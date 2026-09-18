import type { Metadata } from "next";
import { Compass, Home } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { LogoMark } from "@/components/ui/Logo";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you were looking for could not be found on QurbaniHat.",
  robots: { index: false, follow: false },
};

/**
 * Custom 404 page (app/not-found.tsx) — rendered for unknown routes and for
 * `notFound()` calls such as an invalid animal id on /details-page/[id].
 */
export default function NotFound() {
  return (
    <section className="relative overflow-hidden bg-cream">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-brand/10 blur-3xl" />
        <div className="pattern-islamic absolute inset-0 opacity-30" />
      </div>

      <div className="container-page relative flex min-h-[70vh] flex-col items-center justify-center py-16 text-center">
        <LogoMark className="h-14 w-14 rounded-3xl" />

        <p className="mt-6 font-display text-7xl leading-none text-emerald-deep sm:text-9xl">404</p>
        <h1 className="mt-3 text-3xl sm:text-4xl">Animal Not Found</h1>
        <p className="mt-3 max-w-lg text-sm leading-relaxed text-ink-soft sm:text-base">
          The page you are looking for may have been moved, or the livestock listing you opened is
          no longer available. Let&apos;s get you back to the herd.
        </p>

        <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Button href="/" size="lg" leftIcon={<Home className="h-4 w-4" aria-hidden="true" />}>
            Back Home
          </Button>
          <Button
            href="/animals"
            variant="outline"
            size="lg"
            leftIcon={<Compass className="h-4 w-4" aria-hidden="true" />}
          >
            Browse Animals
          </Button>
        </div>
      </div>
    </section>
  );
}