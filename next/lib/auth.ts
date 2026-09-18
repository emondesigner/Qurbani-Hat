import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";

import { buildTrustedOrigins, resolveServerBaseUrl } from "@/lib/app-url";
import { googleCredentials } from "@/lib/auth-flags";
import { getMongoClient, getMongoDb } from "@/lib/mongodb";

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
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // refresh the cookie once per day
  },
  // Must be the last plugin: lets Better Auth write cookies through Next.js.
  plugins: [nextCookies()],
});

export type AuthSession = typeof auth.$Infer.Session;