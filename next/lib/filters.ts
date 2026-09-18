import type { AnimalCategory, SortOrder, TypeFilter } from "@/types";

export type PriceBand = "all" | "under50" | "50to150" | "above150";

export interface AnimalFilterState {
  search: string;
  type: TypeFilter;
  category: "All" | AnimalCategory;
  location: string;
  price: PriceBand;
  sort: SortOrder;
}

export const DEFAULT_FILTERS: AnimalFilterState = {
  search: "",
  type: "All",
  category: "All",
  location: "All",
  price: "all",
  sort: "default",
};

export const PRICE_BAND_LABELS: Record<PriceBand, string> = {
  all: "Any price",
  under50: "Under ৳50,000",
  "50to150": "৳50,000 – 1,50,000",
  above150: "Above 1,50,000",
};

export const TYPE_OPTIONS: { value: TypeFilter; label: string }[] = [
  { value: "All", label: "All" },
  { value: "Cow", label: "Cow" },
  { value: "Goat", label: "Goat" },
];

export const SORT_OPTIONS: { value: SortOrder; label: string }[] = [
  { value: "default", label: "Recommended" },
  { value: "price-asc", label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
];

export const CATEGORY_OPTIONS: { value: "All" | AnimalCategory; label: string }[] = [
  { value: "All", label: "All sizes" },
  { value: "Large Animal", label: "Large Animal" },
  { value: "Medium Animal", label: "Medium Animal" },
  { value: "Small Animal", label: "Small Animal" },
];

export const PRICE_OPTIONS = (Object.keys(PRICE_BAND_LABELS) as PriceBand[]).map((value) => ({
  value,
  label: PRICE_BAND_LABELS[value],
}));

/** Applies every active filter and the chosen price sort to the catalogue. */
export function applyAnimalFilters<T extends { name: string; breed: string; location: string; price: number; type: string; category: string }>(
  list: T[],
  filters: AnimalFilterState,
): T[] {
  const query = filters.search.trim().toLowerCase();

  const filtered = list.filter((animal) => {
    if (query) {
      const haystack = `${animal.name} ${animal.breed} ${animal.location}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    if (filters.type !== "All" && animal.type !== filters.type) return false;
    if (filters.category !== "All" && animal.category !== filters.category) return false;
    if (filters.location !== "All" && animal.location !== filters.location) return false;
    if (filters.price === "under50" && animal.price >= 50000) return false;
    if (filters.price === "50to150" && (animal.price < 50000 || animal.price >= 150000)) return false;
    if (filters.price === "above150" && animal.price < 150000) return false;
    return true;
  });

  if (filters.sort === "price-asc") return [...filtered].sort((a, b) => a.price - b.price);
  if (filters.sort === "price-desc") return [...filtered].sort((a, b) => b.price - a.price);
  return filtered;
}