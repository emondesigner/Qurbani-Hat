"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { friendlyAuthError } from "@/lib/auth-errors";

const FALLBACK =
  "Google sign-in could not be completed. Please try again or use email and password.";

/**
 * Reads the `?error=<code>` query that Better Auth appends when it redirects
 * back from a failed OAuth callback (e.g. the user denied consent, or the
 * Google email could not be linked to an existing account) and turns it into a
 * friendly toast. The parameter is then stripped from the URL so refreshing the
 * page cannot replay the toast.
 */
export function OAuthErrorNotice() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams.get("error");
    if (!error) return;

    const message = friendlyAuthError({ code: error }, FALLBACK);
    toast.error("Google sign-in failed", { description: message });

    const nextUrl = new URL(window.location.href);
    nextUrl.searchParams.delete("error");
    router.replace(nextUrl.toString(), { scroll: false });
  }, [router, searchParams]);

  return null;
}