import { SkeletonProfile } from "@/components/ui/SkeletonCard";

/** Route-level loading UI while the profile session is resolved. */
export default function MyProfileLoading() {
  return (
    <div className="container-page section">
      <SkeletonProfile />
    </div>
  );
}