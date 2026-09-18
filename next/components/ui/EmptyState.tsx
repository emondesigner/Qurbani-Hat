import { PackageOpen } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Consistent empty state used by the animals grid, search results and any
 * list that can legitimately return zero rows.
 */
export function EmptyState({
  title,
  description,
  action,
  icon,
  className,
}: {
  title: string;
  description: string;
  action?: ReactNode;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "surface flex flex-col items-center justify-center gap-4 px-6 py-16 text-center",
        className,
      )}
    >
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand/10 text-brand">
        {icon ?? <PackageOpen className="h-8 w-8" aria-hidden="true" />}
      </span>
      <div className="space-y-2">
        <h3 className="font-display text-2xl text-emerald-deep">{title}</h3>
        <p className="mx-auto max-w-md text-sm leading-relaxed text-ink-soft">{description}</p>
      </div>
      {action}
    </div>
  );
}