import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";

import { buildTrustedOrigins, resolveServerBaseUrl } from "@/lib/app-url";
import { googleCredentials } from "@/lib/auth-flags";
import { getMongoClient, getMongoDb, summarizeError } from "@/lib/mongodb";

/**
 * Server-side Better Auth instance (never imported by client components).
 *
 * Scope for Assignment 8:
 *   - email + password registration and login (minimum 6 characters)
 *   - Google OAuth
 *   - cookie based sessions persisted in MongoDB
 *   - profile updates (name + image)
 *
 * Intentionally NOT enabled: email verification and forgot-password.
 */

/**
 * Origins permitted to call the auth endpoints (CSRF protection).
 * Derived from the environment via lib/app-url.ts so that `0.0.0.0` (a
 * bind-only address) can never leak into the trusted origins, while localhost,
 * 127.0.0.1, Vercel previews and production all work without hardcoded URLs.
 */
export const trustedOrigins = buildTrustedOrigins();

export const auth = betterAuth({
  appName: "QurbaniHat",
  // `undefined` lets Better Auth derive the base URL from the incoming request.
  baseURL: resolveServerBaseUrl(),
  secret: process.env.BETTER_AUTH_SECRET?.trim() || undefined,
  trustedOrigins,
  database: mongodbAdapter(getMongoDb(), { client: getMongoClient() }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    // Assignment flow: after registering, the user signs in from /login.
    autoSignIn: false,
  },
  socialProviders: googleCredentials ? { google: googleCredentials } : undefined,
  /**
   * Better Auth answers an unexpected server failure with a *bodyless* 500, so
   * the cause never reaches the browser. This hook writes a credential-free
   * explanation to the server logs (Vercel → Deployments → Functions → Logs),
   * which makes the failing step of the OAuth start identifiable in production.
   */
  onAPIError: {
    onError: (error: unknown) => {
      console.error(
        `[QurbaniHat] Better Auth server error: ${summarizeError(error)}. ` +
          `Open /api/health for the current database and Google provider status.`,
      );
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // refresh the cookie once per day
  },
  account: {
    accountLinking: {
      // Allow a Google sign-in to be linked to an existing email/password
      // account. Without this, Better Auth refuses to merge the identities and
      // redirects back with an `account_not_linked` error when the email used
      // on Google matches a registered user.
      enabled: true,
      // Google is a "trusted" provider: it always returns a verified email, so
      // linking happens silently without an extra confirmation step. New Google
      // users still get a fresh account — registration behaviour is unchanged.
      trustedProviders: ["google"],
    },
  },
  // Must be the last plugin: lets Better Auth write cookies through Next.js.
  plugins: [nextCookies()],
});

export type AuthSession = typeof auth.$Infer.Session;