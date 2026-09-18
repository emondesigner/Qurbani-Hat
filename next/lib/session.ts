import { connection } from "next/server";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";

/**
 * Authoritative server-side session lookup used by every protected page.
 *
 * `auth.api.getSession` verifies the signed session cookie and resolves the
 * session + user records from MongoDB. Cookie-only checks in proxy.ts are an
 * optimistic UX optimisation; this helper is the real security boundary.
 *
 * `connection()` is awaited first: it explicitly tells Next.js that this render
 * depends on an incoming request, so route handlers are rendered on demand
 * instead of being statically prerendered (which would throw
 * DYNAMIC_SERVER_USAGE and could cache a stale "logged out" navbar).
 *
 * When MongoDB is not reachable (e.g. MONGODB_URI has not been configured yet)
 * the lookup fails and the visitor is treated as signed out, which is the safe
 * default, and the failure is logged for the developer.
 */
export async function getServerSession() {
  // Opt out of static prerendering before touching request-scoped APIs.
  await connection();

  try {
    return await auth.api.getSession({
      headers: await headers(),
    });
  } catch (error) {
    console.error(
      "[QurbaniHat] Session lookup failed. Check MONGODB_URI / BETTER_AUTH_SECRET.",
      error,
    );
    return null;
  }
}