import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });
dotenv.config();

export const app = express();

app.use(express.json());

/**
 * Canonical Google OAuth callback path.
 *
 * MUST stay byte-for-byte identical to:
 *   - GOOGLE_CALLBACK_PATH in src/lib/oauth.ts
 *   - the "Authorized redirect URIs" entry in Google Cloud Console
 */
const GOOGLE_CALLBACK_PATH = '/api/auth/callback/google';

/** Hostnames that are always allowed to receive the OAuth callback. */
const LOCAL_HOSTNAMES = new Set(['localhost', '127.0.0.1', '::1', '[::1]']);

/**
 * Only origins we control may be used as the OAuth redirect target.
 *
 * Without this check a crafted `?origin=` query value would make Google
 * deliver the authorization code to an attacker-controlled host.
 */
function isAllowedOrigin(origin: string): boolean {
  let parsed: URL;
  try {
    parsed = new URL(origin);
  } catch {
    return false;
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return false;
  }

  const hostname = parsed.hostname.toLowerCase();
  if (LOCAL_HOSTNAMES.has(hostname)) return true;
  if (hostname.endsWith('.run.app')) return true; // AI Studio / Cloud Run preview
  if (hostname.endsWith('.vercel.app')) return true; // Vercel deployment

  const appUrl = (process.env.APP_URL || '').trim();
  if (appUrl) {
    try {
      if (new URL(appUrl).origin === parsed.origin) return true;
    } catch {
      // Ignore a malformed APP_URL and fall through to the default host.
    }
  }

  return false;
}

/**
 * Resolves the redirect URI used for BOTH the Google authorization request and
 * the server-side authorization-code exchange.
 *
 * Having a single implementation guarantees the two values can never drift
 * apart — a drift is exactly what produces `Error 400: redirect_uri_mismatch`.
 */
function resolveRedirectUri(req: Request, requestedOrigin?: string): string {
  const candidate = (requestedOrigin || '').trim().replace(/\/+$/, '');

  if (candidate && isAllowedOrigin(candidate)) {
    return `${candidate}${GOOGLE_CALLBACK_PATH}`;
  }

  const host = req.get('host') || 'localhost:3000';
  const forwardedProto = req.headers['x-forwarded-proto'];
  const protocol = (Array.isArray(forwardedProto) ? forwardedProto[0] : forwardedProto) || req.protocol || 'http';

  return `${protocol}://${host}${GOOGLE_CALLBACK_PATH}`;
}

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Safe client auth config endpoint (NEVER exposes GOOGLE_CLIENT_SECRET)
app.get('/api/auth/config', (_req: Request, res: Response) => {
  const clientId = process.env.GOOGLE_CLIENT_ID || '';
  const isConfigured = Boolean(
    clientId &&
    !clientId.includes('your_actual_google_client_id') &&
    !clientId.includes('your_google_client_id')
  );
  res.json({
    clientId: isConfigured ? clientId.trim() : '',
    isConfigured,
  });
});

// Generate Google OAuth authorization URL with authorization code flow
app.get('/api/auth/google/url', (req: Request, res: Response) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (
    !clientId ||
    clientId.includes('your_actual_google_client_id') ||
    clientId.includes('your_google_client_id')
  ) {
    return res.status(400).json({
      error: 'GOOGLE_CLIENT_ID is not configured in .env.local',
    });
  }

  // The client may pass its exact origin (window.location.origin). It is only
  // honoured when it is an allow-listed host, so the redirect URI can never
  // silently drift to a host that is not registered in Google Cloud Console.
  const redirectUri = resolveRedirectUri(
    req,
    req.query.origin ? String(req.query.origin) : undefined
  );

  const stateObj = {
    nonce: Math.random().toString(36).substring(2),
    redirectUri,
  };
  const state = Buffer.from(JSON.stringify(stateObj)).toString('base64');

  const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  googleAuthUrl.searchParams.set('client_id', clientId.trim());
  googleAuthUrl.searchParams.set('redirect_uri', redirectUri);
  googleAuthUrl.searchParams.set('response_type', 'code');
  googleAuthUrl.searchParams.set('scope', 'openid profile email');
  googleAuthUrl.searchParams.set('access_type', 'offline');
  googleAuthUrl.searchParams.set('prompt', 'select_account');
  googleAuthUrl.searchParams.set('state', state);

  return res.json({
    url: googleAuthUrl.toString(),
    redirectUri,
  });
});

// Server-side Google OAuth Callback handler (Exchanges code -> token -> userinfo)
app.get('/api/auth/callback/google', async (req: Request, res: Response, next: NextFunction) => {
  const { code, error, error_description } = req.query;

  // Helper to send popup postMessage or redirect
  const sendAuthError = (errTitle: string, errDesc: string) => {
    return res.send(`
      <!DOCTYPE html>
      <html>
        <head><title>Google Authentication Error</title></head>
        <body style="font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #fef2f2;">
          <div style="text-align: center; padding: 2rem; background: white; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); max-width: 480px;">
            <h2 style="color: #b91c1c; margin-bottom: 0.5rem; font-size: 1.25rem;">${errTitle}</h2>
            <p style="color: #475569; font-size: 0.875rem; margin-bottom: 1.5rem;">${errDesc}</p>
            <button onclick="window.close()" style="background: #e2e8f0; border: none; padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer;">Close Window</button>
          </div>
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: 'OAUTH_AUTH_ERROR', error: ${JSON.stringify(errDesc)} }, '*');
              setTimeout(() => window.close(), 2500);
            } else {
              window.location.href = '/login?error=' + encodeURIComponent('${errTitle}') + '&error_description=' + encodeURIComponent('${errDesc}');
            }
          </script>
        </body>
      </html>
    `);
  };

  // Handle OAuth provider error response (e.g. redirect_uri_mismatch or access_denied)
  if (error) {
    console.error('Google OAuth callback error received:', error, error_description);
    return sendAuthError(
      String(error),
      String(error_description || 'The Google OAuth authorization request was rejected.')
    );
  }

  // If no authorization code, forward to next (SPA handler / AuthCallbackPage)
  if (!code) {
    return next();
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (
    !clientId ||
    !clientSecret ||
    clientId.includes('your_actual') ||
    clientSecret.includes('your_actual')
  ) {
    console.error('Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET on server');
    return sendAuthError(
      'Credentials Missing',
      'GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET is not configured in .env.local.'
    );
  }

  try {
    let redirectUri = '';
    const stateParam = req.query.state ? String(req.query.state) : '';
    if (stateParam) {
      try {
        const decodedState = JSON.parse(Buffer.from(stateParam, 'base64').toString('utf8'));
        if (decodedState && decodedState.redirectUri) {
          redirectUri = decodedState.redirectUri;
        }
      } catch {
        // fallback
      }
    }

    // Fall back to the exact same helper used when building the authorization
    // URL, so the value sent to /token always matches the one Google received.
    if (!redirectUri) {
      redirectUri = resolveRedirectUri(req);
    }

    // 1. Exchange authorization code for tokens securely on the server
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code: String(code),
        client_id: clientId.trim(),
        client_secret: clientSecret.trim(),
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenRes.ok) {
      const errorText = await tokenRes.text();
      console.error('Failed to exchange code for tokens:', errorText);
      return sendAuthError('Token Exchange Failed', errorText);
    }

    const tokenData = (await tokenRes.json()) as { access_token?: string };
    if (!tokenData.access_token) {
      return sendAuthError('Missing Token', 'Google did not return an access token.');
    }

    // 2. Fetch authenticated user profile using access token
    const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    if (!userInfoRes.ok) {
      const userErr = await userInfoRes.text();
      console.error('Failed to fetch userinfo from Google:', userErr);
      return sendAuthError('User Info Error', userErr);
    }

    const userInfo = (await userInfoRes.json()) as {
      sub: string;
      name?: string;
      email?: string;
      picture?: string;
    };

    if (!userInfo.email) {
      return sendAuthError('No Email', 'Google account did not provide a verified email.');
    }

    // 3. Construct clean authenticated session payload (never exposing tokens or secret)
    const sessionUser = {
      id: `google_${userInfo.sub}`,
      name: userInfo.name || userInfo.email.split('@')[0],
      email: userInfo.email.toLowerCase(),
      image: userInfo.picture,
      createdAt: new Date().toISOString(),
    };

    const payloadBase64 = Buffer.from(JSON.stringify(sessionUser)).toString('base64');

    return res.send(`
      <!DOCTYPE html>
      <html>
        <head><title>Google Authentication Successful</title></head>
        <body style="font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #f0fdf4;">
          <div style="text-align: center; padding: 2.5rem; background: white; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); max-width: 440px;">
            <div style="width: 48px; height: 48px; background: #dcfce7; color: #15803d; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem auto; font-size: 24px;">✓</div>
            <h2 style="color: #166534; margin-bottom: 0.5rem; font-size: 1.25rem;">Signed in with Google!</h2>
            <p style="color: #475569; font-size: 0.875rem;">Welcome, <strong>${sessionUser.name}</strong>.</p>
            <p style="color: #94a3b8; font-size: 0.75rem; margin-top: 1rem;">This window will close automatically...</p>
          </div>
          <script>
            const sessionUser = ${JSON.stringify(sessionUser)};
            if (window.opener) {
              window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS', session: sessionUser }, '*');
              setTimeout(() => window.close(), 600);
            } else {
              window.location.href = '/?google_auth_success=1&session=' + encodeURIComponent('${payloadBase64}');
            }
          </script>
        </body>
      </html>
    `);
  } catch (err: unknown) {
    console.error('Unexpected error in OAuth callback handler:', err);
    const msg = err instanceof Error ? err.message : 'Unknown server error';
    return sendAuthError('Server Error', msg);
  }
});

// Export default for Vercel serverless function
export default app;
