import { SkeletonGrid } from "@/components/ui/SkeletonCard";

/** Route-level loading UI for /animals (shown while the server renders). */
export default function AnimalsLoading() {
  return (
    <div className="container-page section">
      <div className="mb-8 flex flex-col items-center gap-4">
        <div className="skeleton h-5 w-28" />
        <div className="skeleton h-10 w-3/4 max-w-xl" />
        <div className="skeleton h-16 w-full max-w-2xl" />
      </div>
      <div className="surface mb-6 h-40 w-full" aria-hidden="true" />
      <SkeletonGrid count={8} />
    </div>
  );
}