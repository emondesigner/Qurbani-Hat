import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Shared, centred section heading with an optional gold eyebrow label. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className,
      )}
    >
      {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
      <h2 className="max-w-3xl text-3xl leading-tight sm:text-4xl lg:text-[2.6rem]">{title}</h2>
      {description ? (
        <p
          className={cn(
            "max-w-2xl text-sm leading-relaxed text-ink-soft sm:text-base",
            align === "center" && "mx-auto",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}

/** Small decorative divider used between sections. */
export function GoldDivider({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex h-1 w-20 rounded-full bg-gradient-to-r from-gold via-gold-soft to-gold",
        className,
      )}
    />
  );
}

export function SectionShell({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn("section", className)}>
      <div className="container-page">{children}</div>
    </section>
  );
}