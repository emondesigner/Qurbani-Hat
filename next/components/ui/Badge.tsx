import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export type BadgeTone = "emerald" | "gold" | "cream" | "outline" | "slate";

const TONES: Record<BadgeTone, string> = {
  emerald: "bg-brand text-white",
  gold: "bg-gold text-white",
  cream: "bg-cream/95 text-emerald-deep",
  outline: "border border-emerald-deep/20 bg-white text-emerald-deep",
  slate: "bg-ink/85 text-cream",
};

export function Badge({
  children,
  tone = "emerald",
  className,
}: {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[0.7rem] font-bold uppercase tracking-wide",
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}