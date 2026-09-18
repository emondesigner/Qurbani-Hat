import { SkeletonGrid } from "@/components/ui/SkeletonCard";

/**
 * Route-level loading UI for the home page: a lightweight skeleton instead of a
 * full-page blocking spinner.
 */
export default function HomeLoading() {
  return (
    <div className="container-page section" role="status" aria-busy="true">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div className="space-y-5">
          <div className="skeleton h-6 w-40" />
          <div className="skeleton h-12 w-full max-w-lg" />
          <div className="skeleton h-12 w-3/4 max-w-md" />
          <div className="skeleton h-20 w-full max-w-xl" />
          <div className="flex gap-3">
            <div className="skeleton h-12 w-40 rounded-full" />
            <div className="skeleton h-12 w-44 rounded-full" />
          </div>
        </div>
        <div className="skeleton h-72 w-full rounded-card sm:h-96" />
      </div>

      <div className="mt-16">
        <SkeletonGrid count={4} />
      </div>
    </div>
  );
}