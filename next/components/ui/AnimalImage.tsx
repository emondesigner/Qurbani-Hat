"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

/**
 * Renders a livestock photo with a graceful, on-brand fallback.
 *
 * Why a plain <img> instead of next/image:
 *   1. The dataset images are served from Wikimedia Commons, whose CDN rejects
 *      requests coming from the Next.js image optimiser (generic user agent),
 *      which would break every photo in production.
 *   2. User supplied avatar URLs can point at any host, so per-host allow-lists
 *      in next.config.ts would be brittle.
 * If an image still fails to load (offline, blocked host, 404) the component
 * swaps in a branded emerald panel with the animal name — a broken image icon
 * can never appear.
 */
export function AnimalImage({
  src,
  alt,
  className,
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  const [hasFailed, setHasFailed] = useState(false);

  // Reset the error flag when the image source changes (state adjustment during
  // render — the React-recommended alternative to an effect).
  const [lastSrc, setLastSrc] = useState(src);
  if (lastSrc !== src) {
    setLastSrc(src);
    setHasFailed(false);
  }

  if (hasFailed || !src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn(
          "flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-deep via-brand to-emerald-mid p-4",
          className,
        )}
      >
        <span className="text-center font-display text-lg leading-snug text-cream/95">{alt}</span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- see component doc comment
    <img
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
      onError={() => setHasFailed(true)}
      className={cn("h-full w-full object-cover", className)}
    />
  );
}