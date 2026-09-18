import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

/**
 * Next.js 16 request proxy (the renamed `middleware.ts`).
 *
 * Optimistic route protection: it only checks whether a Better Auth session
 * cookie is present so unauthenticated visitors are bounced to /login before a
 * protected page is rendered. It is NOT the security boundary — every
 * protected page and API route re-validates the session server-side with
 * `auth.api.getSession()` (see lib/session.ts).
 *
 * Note: /details-page/[id] is deliberately PUBLIC. Anyone may browse an animal,
 * but the booking form on that page is gated server-side (see
 * components/booking/SignInToBook.tsx and app/details-page/[id]/page.tsx).
 */
const PROTECTED_PREFIXES = ["/my-profile"];

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  if (!isProtected) return NextResponse.next();

  const sessionCookie = getSessionCookie(request);
  if (sessionCookie) return NextResponse.next();

  // Send the visitor to /login and remember where they wanted to go so they can
  // be returned there after a successful sign-in.
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("redirect", `${pathname}${search}`);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/my-profile", "/my-profile/:path*"],
};