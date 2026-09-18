"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Compass } from "lucide-react";

import {
  AnimalFilters,
  DEFAULT_FILTERS,
  type AnimalFilterState,
  type PriceBand,
} from "@/components/animals/AnimalFilters";
import { AnimalGrid, GridErrorState } from "@/components/animals/AnimalGrid";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonGrid } from "@/components/ui/SkeletonCard";
import { sortAnimalsByPrice } from "@/lib/animals";
import type { Animal, AnimalsApiResponse } from "@/types";

function applyPriceBand(animals: Animal[], band: PriceBand): Animal[] {
  if (band === "under50") return animals.filter((animal) => animal.price < 50000);
  if (band === "50to150") return animals.filter((animal) => animal.price >= 50000 && animal.price < 150000);
  if (band === "above150") return animals.filter((animal) => animal.price >= 150000);
  return animals;
}

/**
 * All Animals page body.
 *
 * The catalogue is fetched from /api/animals so the loading skeletons, error
 * state and retry button are all genuinely exercised. Filtering and sorting are
 * derived state — no extra network round trips when a control changes.
 */
export function AnimalsExplorer() {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [filters, setFilters] = useState<AnimalFilterState>(DEFAULT_FILTERS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadAnimals() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/animals", {
          signal: controller.signal,
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data = (await response.json()) as AnimalsApiResponse;
        setAnimals(Array.isArray(data.animals) ? data.animals : []);
      } catch (caught) {
        if (caught instanceof DOMException && caught.name === "AbortError") return;
        console.error("[QurbaniHat] Failed to load animals", caught);
        setError(
          "We couldn't reach the livestock catalogue. Please check your internet connection and try again.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    void loadAnimals();
    return () => controller.abort();
  }, [reloadKey]);

  const locations = useMemo(
    () => Array.from(new Set(animals.map((animal) => animal.location))).sort(),
    [animals],
  );

  const visibleAnimals = useMemo(() => {
    const query = filters.search.trim().toLowerCase();

    const filtered = animals.filter((animal) => {
      if (filters.type !== "All" && animal.type !== filters.type) return false;
      if (filters.category !== "All" && animal.category !== filters.category) return false;
      if (filters.location !== "All" && animal.location !== filters.location) return false;
      if (!query) return true;

      return [animal.name, animal.breed, animal.location, animal.type]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });

    return sortAnimalsByPrice(applyPriceBand(filtered, filters.price), filters.sort);
  }, [animals, filters]);

  const handleFilterChange = useCallback((patch: Partial<AnimalFilterState>) => {
    setFilters((current) => ({ ...current, ...patch }));
  }, []);

  const handleReset = useCallback(() => setFilters(DEFAULT_FILTERS), []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="surface h-40 w-full" aria-hidden="true" />
        <SkeletonGrid count={8} />
      </div>
    );
  }

  if (error) {
    return (
      <GridErrorState
        title="Couldn't load the livestock list"
        description={error}
        onRetry={() => setReloadKey((key) => key + 1)}
      />
    );
  }

  return (
    <div className="space-y-8">
      <AnimalFilters
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleReset}
        locations={locations}
        resultCount={visibleAnimals.length}
        totalCount={animals.length}
      />

      {visibleAnimals.length === 0 ? (
        <EmptyState
          title="No animals match your filters"
          description="Try widening the price range, choosing another location or clearing the search box to see more livestock."
          action={
            <Button variant="outline" onClick={handleReset} leftIcon={<Compass className="h-4 w-4" aria-hidden="true" />}>
              Reset filters
            </Button>
          }
        />
      ) : (
        <AnimalGrid animals={visibleAnimals} />
      )}
    </div>
  );
}