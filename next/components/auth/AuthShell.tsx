import Link from "next/link";
import { Quote, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";

import { LogoMark } from "@/components/ui/Logo";

/**
 * Split-screen shell shared by /login and /register: an emerald brand panel
 * with trust proof on the left, the form on the right. Collapses to a single
 * column on mobile so nothing overflows at 320px.
 */
export function AuthShell({
  eyebrow,
  title,
  subtitle,
  children,
  footer,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-cream">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-brand/10 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-gold/10 blur-3xl" />
      </div>

      <div className="container-page relative grid items-stretch gap-8 py-10 lg:grid-cols-[1.05fr_1fr] lg:py-16">
        {/* Brand panel — hidden on small screens to keep the form above the fold. */}
        <aside className="pattern-emerald relative hidden overflow-hidden rounded-card p-8 text-cream shadow-lift lg:flex lg:flex-col lg:justify-between">
          <span aria-hidden="true" className="absolute inset-0 bg-emerald-deep/70" />
          <div className="relative flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-3" aria-label="QurbaniHat home">
              <LogoMark className="bg-cream/15" />
              <span className="font-display text-2xl">
                Qurbani<span className="text-gold-soft">Hat</span>
              </span>
            </Link>

            <h2 className="max-w-sm text-3xl leading-tight text-cream">
              Trusted Livestock Marketplace for Your Qurbani
            </h2>
            <p className="max-w-sm text-sm leading-relaxed text-cream/80">
              Sign in to reserve verified cows and goats from farms across Bangladesh, compare
              transparent prices, and keep every booking request in one place.
            </p>
          </div>

          <ul className="relative mt-10 space-y-3 text-sm text-cream/85">
            {[
              "Vet checked animals with documented weight and age",
              "Secure sessions managed by Better Auth",
              "Email/password and Google sign-in supported",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold-soft" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <p className="relative mt-10 flex items-start gap-3 rounded-2xl bg-cream/10 p-4 text-xs leading-relaxed text-cream/85">
            <Quote className="mt-0.5 h-4 w-4 shrink-0 text-gold-soft" aria-hidden="true" />
            “QurbaniHat made choosing our Eid animal simple and completely transparent.”
          </p>
        </aside>

        <div className="surface flex flex-col justify-center p-6 sm:p-8 lg:p-10">
          <span className="eyebrow self-start">{eyebrow}</span>
          <h1 className="mt-4 text-3xl leading-tight sm:text-[2.1rem]">{title}</h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">{subtitle}</p>

          <div className="mt-7">{children}</div>

          <div className="mt-7 border-t border-emerald-deep/10 pt-5 text-sm text-ink-soft">
            {footer}
          </div>
        </div>
      </div>
    </section>
  );
}