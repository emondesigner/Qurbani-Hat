/**
 * Environment-derived authentication flags.
 *
 * Kept in its own module so server components can read a flag (for example to
 * decide whether to render the Google button) without instantiating the Better
 * Auth / MongoDB clients that lib/auth.ts creates.
 */

const googleClientId = process.env.GOOGLE_CLIENT_ID?.trim();
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();

/** "Continue with Google" is only offered when both credentials are present. */
export const isGoogleProviderConfigured = Boolean(googleClientId && googleClientSecret);

/** Provider credentials for Better Auth, or `null` when Google is not set up. */
export const googleCredentials = isGoogleProviderConfigured
  ? { clientId: googleClientId as string, clientSecret: googleClientSecret as string }
  : null;
