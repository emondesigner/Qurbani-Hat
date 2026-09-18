"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";

import { Select } from "@/components/ui/Field";
import {
  CATEGORY_OPTIONS,
  PRICE_OPTIONS,
  SORT_OPTIONS,
  TYPE_OPTIONS,
  type AnimalFilterState,
} from "@/lib/filters";
import { cn } from "@/lib/utils";

// Re-exported so consumers only need a single import path for filter state.
export { DEFAULT_FILTERS } from "@/lib/filters";
export type { AnimalFilterState, PriceBand } from "@/lib/filters";

/**
 * Filters + sorting toolbar for the All Animals page.
 *
 * Animal type uses accessible toggle chips (aria-pressed) while the remaining
 * controls are native selects — reliable on mobile and keyboard/screen-reader
 * friendly without extra JavaScript.
 */
export function AnimalFilters({
  filters,
  onChange,
  onReset,
  locations,
  resultCount,
  totalCount,
}: {
  filters: AnimalFilterState;
  onChange: (patch: Partial<AnimalFilterState>) => void;
  onReset: () => void;
  locations: string[];
  resultCount: number;
  totalCount: number;
}) {
  const hasActiveFilters =
    filters.search !== "" ||
    filters.type !== "All" ||
    filters.category !== "All" ||
    filters.location !== "All" ||
    filters.price !== "all" ||
    filters.sort !== "default";

  return (
    <div className="surface p-4 sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="w-full lg:max-w-sm">
          <label htmlFor="animal-search" className="field-label">
            Search livestock
          </label>
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft"
              aria-hidden="true"
            />
            <input
              id="animal-search"
              type="search"
              value={filters.search}
              onChange={(event) => onChange({ search: event.target.value })}
              placeholder="Search by name, breed or location…"
              className="field-input pl-9"
            />
          </div>
        </div>

        <fieldset className="w-full lg:w-auto">
          <legend className="field-label">Animal type</legend>
          <div className="flex flex-wrap gap-2">
            {TYPE_OPTIONS.map((option) => {
              const isSelected = filters.type === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => onChange({ type: option.value })}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-semibold transition",
                    isSelected
                      ? "border-brand bg-brand text-white shadow-soft"
                      : "border-emerald-deep/15 bg-white text-emerald-deep hover:border-brand/40 hover:bg-brand/5",
                  )}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </fieldset>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label htmlFor="animal-sort" className="field-label">
            Sort by price
          </label>
          <Select
            id="animal-sort"
            value={filters.sort}
            onChange={(event) =>
              onChange({ sort: event.target.value as AnimalFilterState["sort"] })
            }
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <label htmlFor="animal-category" className="field-label">
            Category
          </label>
          <Select
            id="animal-category"
            value={filters.category}
            onChange={(event) =>
              onChange({ category: event.target.value as AnimalFilterState["category"] })
            }
          >
            {CATEGORY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <label htmlFor="animal-location" className="field-label">
            Location
          </label>
          <Select
            id="animal-location"
            value={filters.location}
            onChange={(event) => onChange({ location: event.target.value })}
          >
            <option value="All">All locations</option>
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <label htmlFor="animal-price" className="field-label">
            Price range
          </label>
          <Select
            id="animal-price"
            value={filters.price}
            onChange={(event) =>
              onChange({ price: event.target.value as AnimalFilterState["price"] })
            }
          >
            {PRICE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-emerald-deep/10 pt-4">
        <p className="flex items-center gap-2 text-sm text-ink-soft" aria-live="polite">
          <SlidersHorizontal className="h-4 w-4 text-brand" aria-hidden="true" />
          Showing <strong className="text-emerald-deep">{resultCount}</strong> of {totalCount}{" "}
          animals
        </p>

        {hasActiveFilters ? (
          <button type="button" onClick={onReset} className="btn btn-md btn-ghost text-red-600">
            <X className="h-4 w-4" aria-hidden="true" />
            Clear filters
          </button>
        ) : null}
      </div>
    </div>
  );
}