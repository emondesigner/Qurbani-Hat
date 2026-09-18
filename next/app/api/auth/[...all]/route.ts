import { toNextJsHandler } from "better-auth/next-js";

import { auth } from "@/lib/auth";

/**
 * Better Auth catch-all route handler.
 *
 * Exposes every auth endpoint under /api/auth/* :
 *   POST /api/auth/sign-up/email        registration
 *   POST /api/auth/sign-in/email        email + password login
 *   POST /api/auth/sign-in/social       Google OAuth start
 *   GET  /api/auth/callback/google      Google OAuth callback
 *   GET  /api/auth/get-session          current session
 *   POST /api/auth/sign-out             logout
 *   POST /api/auth/update-user          profile update
 *
 * Auth runs on the Node.js runtime because the MongoDB driver needs Node APIs.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const { GET, POST } = toNextJsHandler(auth);