"use client";

import { ArrowUpDown, Compass, PackageOpen } from "lucide-react";
import type { ReactNode } from "react";

import { AnimalCard } from "@/components/animals/AnimalCard";
import { cn } from "@/lib/utils";
import type { Animal } from "@/types";

/** Responsive listing grid plus the shared error state for livestock pages. */

export function AnimalGrid({ animals, className }: { animals: Animal[]; className?: string }) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        className,
      )}
    >
      {animals.map((animal, index) => (
        // Small row-based stagger: cards in the same column animate together.
        <AnimalCard key={animal.id} animal={animal} delay={(index % 4) * 60} />
      ))}
    </div>
  );
}

export function GridErrorState({
  title = "We couldn't load the livestock list",
  description = "Something went wrong while fetching the animals. Please check your connection and try again.",
  onRetry,
  action,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
  action?: ReactNode;
}) {
  return (
    <div className="surface flex flex-col items-center gap-4 px-6 py-12 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
        <PackageOpen className="h-7 w-7" aria-hidden="true" />
      </span>
      <div className="space-y-2">
        <h3 className="font-display text-2xl text-emerald-deep">{title}</h3>
        <p className="mx-auto max-w-md text-sm leading-relaxed text-ink-soft">{description}</p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        {onRetry ? (
          <button type="button" onClick={onRetry} className="btn btn-md btn-primary">
            <ArrowUpDown className="h-4 w-4" aria-hidden="true" />
            Try again
          </button>
        ) : null}
        {action}
        <a href="/animals" className="btn btn-md btn-outline">
          <Compass className="h-4 w-4" aria-hidden="true" />
          Browse other animals
        </a>
      </div>
    </div>
  );
}
