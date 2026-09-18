"use client";

import { useState } from "react";

import { cn, initialsFromName } from "@/lib/utils";

/**
 * User avatar: shows the Better Auth profile image, falling back to the user's
 * initials on a deep-emerald disc when no image is set or the URL fails.
 */
export function Avatar({
  name,
  src,
  size = 40,
  className,
}: {
  name: string;
  src?: string | null;
  size?: number;
  className?: string;
}) {
  const [hasFailed, setHasFailed] = useState(false);

  // Reset the error flag when the avatar URL changes (state adjustment during
  // render — the React-recommended alternative to an effect).
  const [lastSrc, setLastSrc] = useState(src);
  if (lastSrc !== src) {
    setLastSrc(src);
    setHasFailed(false);
  }

  const dimension = { width: size, height: size };

  if (!src || hasFailed) {
    return (
      <span
        style={dimension}
        aria-hidden="true"
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-deep to-brand text-xs font-bold tracking-wide text-cream",
          className,
        )}
      >
        {initialsFromName(name)}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- avatars live on arbitrary external hosts
    <img
      src={src}
      alt={name}
      style={dimension}
      onError={() => setHasFailed(true)}
      className={cn("shrink-0 rounded-full object-cover ring-2 ring-brand/25", className)}
    />
  );
}