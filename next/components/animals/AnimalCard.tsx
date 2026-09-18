"use client";

import Link from "next/link";
import { animated, useSpring } from "@react-spring/web";
import { MapPin, Scale, Tag, Weight } from "lucide-react";
import { useEffect, useState } from "react";

import { AnimalImage } from "@/components/ui/AnimalImage";
import { Badge } from "@/components/ui/Badge";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { cn, formatBDT } from "@/lib/utils";
import type { Animal } from "@/types";

/**
 * Livestock card used on the home page (featured) and the All Animals grid.
 *
 * React Spring drives two independent motions so the interaction stays
 * GPU-friendly (transform + shadow only — no layout thrash):
 *   1. a staggered fade/slide entrance (`delay` prop)
 *   2. a hover/focus lift
 */
export function AnimalCard({
  animal,
  className,
  priority = false,
  delay = 0,
}: {
  animal: Animal;
  className?: string;
  priority?: boolean;
  delay?: number;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    // Cap the stagger so late cards in a long grid never feel sluggish.
    const timer = window.setTimeout(() => setHasEntered(true), Math.min(delay, 360));
    return () => window.clearTimeout(timer);
  }, [delay]);

  const isVisible = hasEntered || prefersReducedMotion;

  const enterStyles = useSpring({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? "translate3d(0,0,0)" : "translate3d(0,18px,0)",
    immediate: prefersReducedMotion,
    config: { tension: 210, friction: 28 },
  });

  const hoverStyles = useSpring({
    transform: isHovered && !prefersReducedMotion ? "translate3d(0,-6px,0)" : "translate3d(0,0,0)",
    boxShadow:
      isHovered && !prefersReducedMotion
        ? "0 26px 48px -26px rgba(6,78,59,0.45)"
        : "0 14px 30px -24px rgba(6,78,59,0.35)",
    immediate: prefersReducedMotion,
    config: { tension: 260, friction: 24 },
  });

  return (
    <animated.div style={enterStyles} className="h-full">
    <animated.article
      style={hoverStyles}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-card border border-emerald-deep/10 bg-white",
        className,
      )}
    >
      <div className="relative h-52 overflow-hidden">
        <AnimalImage
          src={animal.image}
          alt={`${animal.name} — ${animal.breed} ${animal.type.toLowerCase()} in ${animal.location}`}
          priority={priority}
          className="transition-transform duration-500 group-hover:scale-[1.06]"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <Badge tone="emerald">{animal.type}</Badge>
          <Badge tone="cream">{animal.category}</Badge>
        </div>
        <p className="absolute bottom-3 right-3 rounded-full bg-emerald-deep/90 px-3 py-1.5 text-sm font-bold text-cream backdrop-blur-sm">
          {formatBDT(animal.price)}
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3 className="text-xl leading-snug text-emerald-deep">
            <Link
              href={`/details-page/${animal.id}`}
              className="transition-colors hover:text-brand focus-visible:text-brand"
            >
              {animal.name}
            </Link>
          </h3>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-soft">
            <Tag className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
            {animal.breed}
          </p>
        </div>

        <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Weight className="h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
            <dt className="sr-only">Weight</dt>
            <dd className="font-semibold text-ink">{animal.weight} kg</dd>
          </div>
          <div className="flex items-center gap-2">
            <Scale className="h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
            <dt className="sr-only">Age</dt>
            <dd className="font-semibold text-ink">
              {animal.age} {animal.age === 1 ? "year" : "years"}
            </dd>
          </div>
          <div className="col-span-2 flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
            <dt className="sr-only">Location</dt>
            <dd className="truncate text-ink-soft">{animal.location}</dd>
          </div>
        </dl>

        <Link
          href={`/details-page/${animal.id}`}
          className="btn btn-md btn-outline mt-auto w-full group-hover:bg-brand group-hover:text-white"
          aria-label={`View details for ${animal.name}`}
        >
          View Details
        </Link>
      </div>
    </animated.article>
    </animated.div>
  );
}