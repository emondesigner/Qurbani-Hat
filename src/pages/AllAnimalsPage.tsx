import React, { useState, useMemo, useEffect } from 'react';
import { getAllAnimals } from '../lib/animals';
import { AnimalCard } from '../components/AnimalCard';
import { SkeletonCard } from '../components/LoadingStates';
import { useRouter } from '../lib/router-context';
import { Animal, SortOrder } from '../types';
import { 
  ArrowDownUp, 
  Filter, 
  RotateCcw, 
  Search, 
  Compass, 
  Sparkles 
} from 'lucide-react';

export function AllAnimalsPage() {
  const { searchParams } = useRouter();
  const allAnimals = getAllAnimals();

  const [isLoading, setIsLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<SortOrder>('none');
  const [typeFilter, setTypeFilter] = useState<string>(searchParams.get('type') || 'all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Initial simulated loading state as required by Requirement 20
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, []);

  // Update type filter if URL search param changes
  useEffect(() => {
    const typeParam = searchParams.get('type');
    if (typeParam) {
      setTypeFilter(typeParam);
    }
  }, [searchParams]);

  // Filter and Sort Animals
  const filteredAndSortedAnimals = useMemo(() => {
    let result = [...allAnimals];

    // Filter by Type
    if (typeFilter !== 'all') {
      result = result.filter(a => a.type.toLowerCase() === typeFilter.toLowerCase());
    }

    // Filter by Category
    if (categoryFilter !== 'all') {
      result = result.filter(a => a.category.toLowerCase() === categoryFilter.toLowerCase());
    }

    // Filter by Search Query (Name, Breed, Location)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        a =>
          a.name.toLowerCase().includes(q) ||
          a.breed.toLowerCase().includes(q) ||
          a.location.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q)
      );
    }

    // Sort by Price
    if (sortOrder === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [allAnimals, typeFilter, categoryFilter, searchQuery, sortOrder]);

  const resetFilters = () => {
    setSortOrder('none');
    setTypeFilter('all');
    setCategoryFilter('all');
    setSearchQuery('');
  };

  const hasActiveFilters =
    sortOrder !== 'none' ||
    typeFilter !== 'all' ||
    categoryFilter !== 'all' ||
    searchQuery.trim() !== '';

  return (
    <div className="bg-[#faf8f5] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100/80 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-3">
            <Compass className="w-3.5 h-3.5 text-emerald-700" />
            <span>Complete Marketplace Catalog</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 font-serif tracking-tight">
            All Qurbani Animals
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl">
            Browse our handpicked registry of sacrificial cows, prize bulls, and goats across Bangladesh. Filter by price, breed, and size.
          </p>
        </div>

        {/* Filter and Sort Toolbar */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-emerald-100 shadow-xs mb-8 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Search Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by breed, name, or location..."
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:bg-white outline-hidden transition-all"
                id="animal-search-input"
              />
            </div>

            {/* Type Filter */}
            <div>
              <select
                id="type-filter-select"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:bg-white outline-hidden cursor-pointer font-medium text-slate-700"
              >
                <option value="all">All Livestock Types</option>
                <option value="cow">Cows & Cattle</option>
                <option value="goat">Goats</option>
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <select
                id="category-filter-select"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:bg-white outline-hidden cursor-pointer font-medium text-slate-700"
              >
                <option value="all">All Size Categories</option>
                <option value="large animal">Large Animal</option>
                <option value="medium animal">Medium Animal</option>
                <option value="small animal">Small Animal</option>
              </select>
            </div>

            {/* MANDATORY PRICE SORTING */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-800">
                <ArrowDownUp className="w-4 h-4" />
              </div>
              <select
                id="price-sort-select"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-emerald-50/50 border border-emerald-300 font-semibold rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:bg-white outline-hidden cursor-pointer text-emerald-950"
              >
                <option value="none">Sort by Price (Default)</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>

          </div>

          {/* Active Filter Indicators & Reset Button */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
            <div className="text-slate-500 font-medium">
              Showing <strong className="text-slate-900">{filteredAndSortedAnimals.length}</strong> of{' '}
              <strong className="text-slate-900">{allAnimals.length}</strong> verified animals
              {sortOrder !== 'none' && (
                <span className="ml-2 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                  Sorted: {sortOrder === 'price-asc' ? 'Low to High' : 'High to Low'}
                </span>
              )}
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 transition-colors font-semibold cursor-pointer"
                id="reset-filters-btn"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        </div>

        {/* Animals Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filteredAndSortedAnimals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedAnimals.map((animal, idx) => (
              <AnimalCard key={animal.id} animal={animal} index={idx} />
            ))}
          </div>
        ) : (
          /* MANDATORY EMPTY STATE */
          <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center max-w-lg mx-auto my-12 space-y-4 shadow-sm animate__animated animate__fadeIn">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
              <Search className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold font-serif text-slate-900">
              No animals found.
            </h2>
            <p className="text-sm text-slate-600">
              We couldn't find any livestock matching your current filter criteria. Try adjusting your filters or search terms.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={resetFilters}
                className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm shadow-sm hover:shadow transition-all cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
