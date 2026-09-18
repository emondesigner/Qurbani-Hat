import type { ReactNode } from "react";

/** Floating trust badge used over the hero photo. */
export function FloatBadge({
  children,
  icon,
  className,
  tone = "brand",
}: {
  children: ReactNode;
  icon: ReactNode;
  className?: string;
  tone?: "brand" | "gold";
}) {
  return (
    <span
      className={[
        "absolute hidden items-center gap-2 rounded-2xl px-3.5 py-2 text-xs font-bold shadow-lift sm:inline-flex",
        tone === "gold" ? "bg-gold text-white" : "bg-emerald-deep text-cream",
        className ?? "",
      ].join(" ")}
    >
      {icon}
      {children}
    </span>
  );
}

/** Small stat pair used inside the hero stat strip. */
export function Stat({ value, label }: { value: string; label: string }) {
  return (
    <span className="flex flex-col items-center leading-tight">
      <span className="font-display text-lg text-emerald-deep">{value}</span>
      <span className="text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-ink-soft">
        {label}
      </span>
    </span>
  );
}