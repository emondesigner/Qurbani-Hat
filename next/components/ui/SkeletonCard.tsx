import { cn } from "@/lib/utils";

/**
 * Skeleton placeholder that mirrors the real AnimalCard layout so the
 * transition from loading to loaded content does not shift the page.
 */
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("surface overflow-hidden", className)} aria-hidden="true">
      <div className="skeleton h-52 w-full rounded-none" />
      <div className="space-y-3 p-5">
        <div className="skeleton h-4 w-20" />
        <div className="skeleton h-6 w-3/4" />
        <div className="skeleton h-4 w-1/2" />
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="skeleton h-4 w-full" />
          <div className="skeleton h-4 w-full" />
        </div>
        <div className="skeleton h-10 w-full rounded-full" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 8, className }: { count?: number; className?: string }) {
  return (
    <div
      className={cn("grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4", className)}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="sr-only">Loading livestock listings…</span>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
}

/** Skeleton for the animal details page. */
export function SkeletonDetails() {
  return (
    <div className="grid gap-10 lg:grid-cols-2" role="status" aria-busy="true">
      <span className="sr-only">Loading animal details…</span>
      <div className="skeleton h-80 w-full rounded-card sm:h-[26rem]" />
      <div className="space-y-4">
        <div className="skeleton h-4 w-24" />
        <div className="skeleton h-9 w-3/4" />
        <div className="skeleton h-4 w-1/2" />
        <div className="skeleton h-24 w-full" />
        <div className="grid grid-cols-2 gap-4">
          <div className="skeleton h-16 w-full" />
          <div className="skeleton h-16 w-full" />
        </div>
        <div className="skeleton h-12 w-52 rounded-full" />
      </div>
    </div>
  );
}

/** Skeleton for the profile card. */
export function SkeletonProfile() {
  return (
    <div className="surface mx-auto max-w-xl p-8" role="status" aria-busy="true">
      <span className="sr-only">Loading profile…</span>
      <div className="flex flex-col items-center gap-4">
        <div className="skeleton h-24 w-24 rounded-full" />
        <div className="skeleton h-6 w-40" />
        <div className="skeleton h-4 w-56" />
      </div>
      <div className="mt-8 space-y-3">
        <div className="skeleton h-12 w-full" />
        <div className="skeleton h-12 w-full" />
      </div>
    </div>
  );
}