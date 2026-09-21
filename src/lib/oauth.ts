/**
 * Single source of truth for the Google OAuth callback URL.
 *
 * The server (api/index.ts) and the client (LoginPage / RegisterPage /
 * AuthCallbackPage) must derive the callback URL from exactly the same value.
 * If they drift even slightly Google answers with:
 *   Error 400: redirect_uri_mismatch
 *
 * Keep this path in sync with:
 *   - api/index.ts (GOOGLE_CALLBACK_PATH constant)
 *   - Google Cloud Console -> APIs & Services -> Credentials ->
 *     OAuth 2.0 Client ID -> Authorized redirect URIs
 */
export const GOOGLE_CALLBACK_PATH = '/api/auth/callback/google';

/** Builds `<origin>/api/auth/callback/google`, trimming any trailing slash. */
export function getGoogleRedirectUri(origin: string): string {
  return `${origin.replace(/\/+$/, '')}${GOOGLE_CALLBACK_PATH}`;
}

/** The exact redirect URI for the origin this app is currently served from. */
export function getCurrentGoogleRedirectUri(): string {
  if (typeof window === 'undefined') {
    return '';
  }
  return getGoogleRedirectUri(window.location.origin);
}
