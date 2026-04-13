'use client';

import { useState, useCallback } from 'react';

const PLATFORMS = [
  { key: 'taobao', label: 'Taobao' },
  { key: 'jd', label: 'JD.com' },
  { key: '1688', label: '1688' },
  { key: 'pinduoduo', label: 'Pinduoduo' },
];

const SORT_OPTIONS = [
  { value: 'best_value', label: 'Best Value' },
  { value: 'lowest_price', label: 'Lowest Price' },
  { value: 'best_rated', label: 'Best Rated' },
  { value: 'most_popular', label: 'Most Popular' },
];

export interface FilterValues {
  platforms: string[];
  priceMin: number | null;
  priceMax: number | null;
  minRating: number;
  sort: string;
}

interface FilterSidebarProps {
  onFilter?: (filters: FilterValues) => void;
}

const DEFAULT_FILTERS: FilterValues = {
  platforms: PLATFORMS.map((p) => p.key),
  priceMin: null,
  priceMax: null,
  minRating: 0,
  sort: 'best_value',
};

export default function FilterSidebar({ onFilter }: FilterSidebarProps) {
  const [filters, setFilters] = useState<FilterValues>({ ...DEFAULT_FILTERS });

  const togglePlatform = useCallback((key: string) => {
    setFilters((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(key)
        ? prev.platforms.filter((p) => p !== key)
        : [...prev.platforms, key],
    }));
  }, []);

  function handleApply() {
    if (onFilter) {
      onFilter(filters);
    } else {
      console.log('Filters applied:', filters);
    }
  }

  function handleReset() {
    setFilters({ ...DEFAULT_FILTERS });
  }

  return (
    <aside className="w-full rounded-xl border border-gray-100 bg-white p-5 shadow-sm space-y-6">
      {/* Platforms */}
      <section>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
          Platforms
        </h4>
        <div className="space-y-2">
          {PLATFORMS.map((p) => (
            <label key={p.key} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.platforms.includes(p.key)}
                onChange={() => togglePlatform(p.key)}
                className="h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent/40 cursor-pointer"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                {p.label}
              </span>
            </label>
          ))}
        </div>
      </section>

      {/* Price Range */}
      <section>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
          Price Range (CNY)
        </h4>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            placeholder="Min"
            value={filters.priceMin ?? ''}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                priceMin: e.target.value ? Number(e.target.value) : null,
              }))
            }
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-colors"
          />
          <span className="text-gray-300 text-sm">-</span>
          <input
            type="number"
            min={0}
            placeholder="Max"
            value={filters.priceMax ?? ''}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                priceMax: e.target.value ? Number(e.target.value) : null,
              }))
            }
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-colors"
          />
        </div>
      </section>

      {/* Min Rating */}
      <section>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
          Minimum Rating
        </h4>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  minRating: prev.minRating === star ? 0 : star,
                }))
              }
              className="p-0.5 transition-transform hover:scale-110"
              aria-label={`${star} star${star > 1 ? 's' : ''}`}
            >
              <svg
                className={`h-6 w-6 transition-colors ${
                  star <= filters.minRating ? 'text-amber-400' : 'text-gray-200'
                }`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
          ))}
          {filters.minRating > 0 && (
            <span className="ml-2 text-xs text-gray-400">& up</span>
          )}
        </div>
      </section>

      {/* Sort */}
      <section>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
          Sort By
        </h4>
        <select
          value={filters.sort}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, sort: e.target.value }))
          }
          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 bg-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-colors cursor-pointer"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </section>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="button"
          onClick={handleApply}
          className="flex-1 px-4 py-2.5 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors focus:outline-none focus:ring-2 focus:ring-accent/40"
        >
          Apply Filters
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="px-4 py-2.5 rounded-lg text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Reset
        </button>
      </div>
    </aside>
  );
}
