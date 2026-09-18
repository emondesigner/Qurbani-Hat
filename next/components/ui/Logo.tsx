import Link from "next/link";

import { cn } from "@/lib/utils";

/**
 * QurbaniHat wordmark: a stylised cattle head inside an emerald arch with a
 * gold crescent accent — used in the navbar, footer and auth pages.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-emerald-deep shadow-[0_10px_22px_-14px_rgba(4,120,87,0.95)]",
        className,
      )}
      aria-hidden="true"
    >
      <svg viewBox="0 0 64 64" className="h-7 w-7" fill="none">
        <path
          d="M32 9c3.1 0 6 1.2 8.2 3.3l-2.9 2.9A7.6 7.6 0 0 0 32 13.2a7.6 7.6 0 0 0-5.3 2l-2.9-2.9A11.6 11.6 0 0 1 32 9Z"
          fill="#f0b429"
        />
        <path
          d="M15 25c3.9 0 7 3.1 7 7v4h20v-4c0-3.9 3.1-7 7-7h5v8c0 3.9-3.1 7-7 7h-1.5v11h-7V40h-13v11h-7V40H17c-3.9 0-7-3.1-7-7v-8h5Z"
          fill="#FAF8F5"
        />
        <circle cx="22" cy="33" r="2" fill="#047857" />
        <circle cx="42" cy="33" r="2" fill="#047857" />
      </svg>
    </span>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("group flex items-center gap-2.5 rounded-2xl", className)}
      aria-label="QurbaniHat home"
    >
      <LogoMark />
      <span className="flex flex-col leading-none">
        <span className="font-display text-xl tracking-tight text-emerald-deep transition-colors group-hover:text-brand">
          Qurbani<span className="text-gold">Hat</span>
        </span>
        <span className="mt-0.5 hidden text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-ink-soft sm:block">
          Trusted Livestock
        </span>
      </span>
    </Link>
  );
}