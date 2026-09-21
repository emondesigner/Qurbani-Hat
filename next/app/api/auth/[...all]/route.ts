import { toNextJsHandler } from "better-auth/next-js";
import type { NextRequest } from "next/server";

import { auth } from "@/lib/auth";
import { guardDatabaseBackedAuthRequest } from "@/lib/auth-guard";
import { summarizeError } from "@/lib/mongodb";

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
 *
 * Two safety nets wrap Better Auth here:
 *
 * 1. `guardDatabaseBackedAuthRequest` (lib/auth-guard.ts) — when MongoDB is
 *    unreachable Better Auth logs the driver error server-side and answers with
 *    a *bodyless* 500. The browser then receives no message at all, which is why
 *    a database outage used to surface as a vague "we could not start Google
 *    sign-in" even though the OAuth client was configured correctly. The guard
 *    detects the outage up front and returns a structured 503 instead.
 *
 * 2. `normaliseServerError` — any remaining 5xx without a usable body is
 *    rewritten as JSON so lib/auth-errors.ts always has something actionable to
 *    show the visitor.
 *
 * The runtime state of the whole chain is exposed (secret-free) at `/api/health`.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const handlers = toNextJsHandler(auth);

/** Structured, cache-free error body that the auth client can always parse. */
function failureResponse(
  message: string,
  code: string,
  status: number,
  detail: string,
): Response {
  console.error(`[QurbaniHat] Auth backend failure (${status} ${code}): ${detail}`);

  return Response.json(
    { code, message, detail },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}

/**
 * Passes real error bodies through untouched and replaces Better Auth's empty
 * 5xx responses with JSON.
 */
async function normaliseServerError(response: Response): Promise<Response> {
  if (response.status < 500) return response;

  const body = await response.text();

  if (body.trim().length > 0) {
    // Preserve the original status, body and headers (including Set-Cookie).
    return new Response(body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
  }

  return failureResponse(
    "The authentication service is temporarily unavailable. Please try again in a moment.",
    "SERVER_ERROR",
    response.status,
    "Better Auth returned an empty 5xx response — see the server logs for the originating error.",
  );
}

async function handle(request: NextRequest, method: "GET" | "POST"): Promise<Response> {
  const blocked = await guardDatabaseBackedAuthRequest(request);
  if (blocked) return blocked;

  try {
    return await normaliseServerError(await handlers[method](request));
  } catch (error) {
    return failureResponse(
      "The authentication service is temporarily unavailable. Please try again in a moment.",
      "SERVER_ERROR",
      503,
      summarizeError(error),
    );
  }
}

export function GET(request: NextRequest) {
  return handle(request, "GET");
}

export function POST(request: NextRequest) {
  return handle(request, "POST");
}
