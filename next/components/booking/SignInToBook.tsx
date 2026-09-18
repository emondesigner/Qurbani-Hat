"use client";

import Link from "next/link";
import { LockKeyhole } from "lucide-react";

import { Button } from "@/components/ui/Button";

/**
 * Booking gate shown on /details-page/[id] for signed-out visitors.
 *
 * The animal itself is public (browsing must stay open), but the booking flow is
 * authenticated only. This panel explains that and deep-links to /login with a
 * `redirect` back to this exact listing so the user lands back here after
 * signing in.
 */
export function SignInToBook({
  animalId,
  animalName,
}: {
  animalId: number;
  animalName: string;
}) {
  const loginHref = `/login?redirect=${encodeURIComponent(`/details-page/${animalId}`)}`;
  const registerHref = `/register?redirect=${encodeURIComponent(`/details-page/${animalId}`)}`;

  return (
    <section id="booking-form" className="scroll-mt-24" aria-label="Booking requires sign in">
      <div className="surface flex flex-col items-center gap-5 px-6 py-12 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand/10 text-brand">
          <LockKeyhole className="h-8 w-8" aria-hidden="true" />
        </span>

        <div className="space-y-2">
          <h2 className="text-2xl leading-snug sm:text-3xl">Sign in to book {animalName}</h2>
          <p className="mx-auto max-w-md text-sm leading-relaxed text-ink-soft">
            Booking requests are available to signed-in members only. Log in or create a free
            QurbaniHat account to reserve this animal — it takes less than a minute.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Button href={loginHref} size="lg">
            Login to Book
          </Button>
          <Button href={registerHref} variant="outline" size="lg">
            Create Free Account
          </Button>
        </div>

        <p className="text-xs text-ink-soft">
          Already signed in?{" "}
          <Link href="/login" className="link">
            Refresh the page
          </Link>{" "}
          after logging in to continue.
        </p>
      </div>
    </section>
  );
}