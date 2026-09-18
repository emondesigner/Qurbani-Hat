import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

const SIZES = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-9 w-9",
} as const;

export function LoadingSpinner({
  size = "md",
  className,
  label = "Loading",
}: {
  size?: keyof typeof SIZES;
  className?: string;
  label?: string;
}) {
  return (
    <span role="status" aria-live="polite" className={cn("inline-flex items-center gap-2", className)}>
      <Loader2 className={cn("animate-spin text-brand", SIZES[size])} aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </span>
  );
}

/** Centred spinner used inside sections and small containers. */
export function LoadingPanel({ label = "Loading…", className }: { label?: string; className?: string }) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3 py-20", className)}>
      <LoadingSpinner size="lg" label={label} />
      <p className="text-sm font-medium text-ink-soft">{label}</p>
    </div>
  );
}