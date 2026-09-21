import { NextResponse } from "next/server";

import { resolvePublicBaseUrl, resolveServerBaseUrl } from "@/lib/app-url";
import { isGoogleProviderConfigured } from "@/lib/auth-flags";
import { getDatabaseStatus } from "@/lib/mongodb";

/**
 * Deployment diagnostics for the auth stack — contains NO secrets.
 *
 * Visit `/api/health` on any deployment to see, in one request, exactly which
 * part of the sign-in chain is broken:
 *
 *   mongodb.reachable  false -> every auth endpoint 500s before Google is ever
 *                               contacted. Fix MONGODB_URI (Vercel → Settings →
 *                               Environment Variables) and/or allow the
 *                               deployment's IP in Atlas → Network Access.
 *   google.expectedRedirectUri -> the exact value Better Auth sends to Google.
 *                               It must be registered verbatim in Google Cloud
 *                               Console → Credentials → OAuth 2.0 Client ID →
 *                               Authorized redirect URIs, otherwise Google
 *                               answers `redirect_uri_mismatch`.
 *
 * `detail` strings are produced by lib/mongodb.ts and are stripped of any
 * credentials, so this endpoint is safe to open in a browser.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Better Auth's Google callback path (must match the Google console entry). */
const GOOGLE_CALLBACK_PATH = "/api/auth/callback/google";

export async function GET() {
  try {
    const database = await getDatabaseStatus(true);
    const baseUrl = resolveServerBaseUrl() ?? resolvePublicBaseUrl();
    const secretConfigured = Boolean(process.env.BETTER_AUTH_SECRET?.trim());

    const checks = {
      mongodb: {
        configured: database.configured,
        reachable: database.reachable,
        kind: database.kind,
        detail: database.detail,
      },
      betterAuth: {
        secretConfigured,
        baseUrl,
      },
      google: {
        credentialsConfigured: isGoogleProviderConfigured,
        expectedRedirectUri: `${baseUrl}${GOOGLE_CALLBACK_PATH}`,
      },
    };

    const ok = database.reachable && secretConfigured;

    return NextResponse.json(
      { ok, checks, timestamp: new Date().toISOString() },
      { status: ok ? 200 : 503, headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("[QurbaniHat] /api/health failed:", error);
    return NextResponse.json(
      {
        ok: false,
        checks: null,
        message: "The diagnostics endpoint could not complete. Check the server logs.",
      },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
