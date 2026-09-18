"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/Button";
import { authClient } from "@/lib/auth-client";
import { friendlyAuthError, GOOGLE_NOT_CONFIGURED_MESSAGE } from "@/lib/auth-errors";

/**
 * "Continue with Google" button (Better Auth social provider).
 *
 * The redirect target is built from `window.location.origin`, so it always
 * matches the environment that is actually serving the app (localhost, Vercel
 * preview or production) instead of a hardcoded URL. The matching redirect URI
 * must be registered in the Google Cloud console:
 *   <origin>/api/auth/callback/google
 */
export function GoogleAuthButton({
  callbackPath = "/",
  googleEnabled = true,
  label = "Continue with Google",
}: {
  callbackPath?: string;
  googleEnabled?: boolean;
  label?: string;
}) {
  const [isRedirecting, setIsRedirecting] = useState(false);

  async function handleGoogleSignIn() {
    if (!googleEnabled) {
      toast.error("Google sign-in unavailable", {
        description: GOOGLE_NOT_CONFIGURED_MESSAGE,
      });
      return;
    }

    setIsRedirecting(true);

    try {
      const callbackURL = `${window.location.origin}${callbackPath}`;
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL,
      });

      if (error) {
        toast.error("Google sign-in failed", {
          description: friendlyAuthError(error, "We could not start Google sign-in. Please try again."),
        });
        setIsRedirecting(false);
      }
      // On success the browser navigates to Google, so the loading state stays.
    } catch (error) {
      toast.error("Google sign-in failed", {
        description: friendlyAuthError(error, "We could not start Google sign-in. Please try again."),
      });
      setIsRedirecting(false);
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      fullWidth
      loading={isRedirecting}
      onClick={handleGoogleSignIn}
      ariaLabel={label}
      leftIcon={
        !isRedirecting ? (
          <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
            <path
              fill="#4285F4"
              d="M23.5 12.3c0-.9-.1-1.5-.2-2.2H12v4.2h6.5c-.1 1.1-.8 2.7-2.4 3.8l-.02.15 3.5 2.7.24.02c2.2-2 3.4-5 3.4-8.7Z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.2 0 5.9-1.1 7.8-2.9l-3.7-2.9c-1 .7-2.4 1.2-4.1 1.2a7.1 7.1 0 0 1-6.7-4.9l-.14.01-3.6 2.8-.05.14A12 12 0 0 0 12 24Z"
            />
            <path
              fill="#FBBC05"
              d="M5.3 14.5a7.3 7.3 0 0 1 0-4.9l-.01-.16-3.7-2.9-.12.06a12 12 0 0 0 0 10.8l3.8-2.9Z"
            />
            <path
              fill="#EA4335"
              d="M12 4.7c2.3 0 3.9 1 4.8 1.9l3.5-3.4C18.1 1.2 15.2 0 12 0A12 12 0 0 0 1.5 6.5l3.8 2.9A7.2 7.2 0 0 1 12 4.7Z"
            />
          </svg>
        ) : undefined
      }
    >
      {isRedirecting ? "Redirecting to Google…" : label}
    </Button>
  );
}