import { SkeletonDetails } from "@/components/ui/SkeletonCard";

/** Route-level loading UI for /details-page/[id]. */
export default function AnimalDetailsLoading() {
  return (
    <div className="container-page section">
      <div className="skeleton mb-8 h-4 w-40" />
      <SkeletonDetails />
      <div className="mt-14 surface p-6">
        <div className="skeleton h-6 w-52" />
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="skeleton h-16 w-full" />
          <div className="skeleton h-16 w-full" />
          <div className="skeleton h-16 w-full" />
          <div className="skeleton h-16 w-full" />
          <div className="skeleton h-24 w-full sm:col-span-2" />
        </div>
      </div>
    </div>
  );
}