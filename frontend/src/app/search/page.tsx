import SearchBar from "@/components/SearchBar";
import Link from "next/link";

import type { ProductListItem } from "@/types/product";

const MOCK_PRODUCTS: ProductListItem[] = [
  {
    id: "prod-001",
    nameEn: "Wireless Bluetooth Earbuds TWS",
    category: "electronics",
    brand: "SoundPro",
    bestPrice: 49.9,
    bestPricePlatform: "Taobao",
    imageUrl: null,
    platformCount: 4,
    updatedAt: "2026-04-12T10:30:00Z",
  },
  {
    id: "prod-002",
    nameEn: "USB-C to HDMI Adapter 4K 60Hz",
    category: "electronics",
    brand: "ConnectX",
    bestPrice: 28.5,
    bestPricePlatform: "1688",
    imageUrl: null,
    platformCount: 3,
    updatedAt: "2026-04-12T09:15:00Z",
  },
  {
    id: "prod-003",
    nameEn: "Portable LED Desk Lamp Touch Control",
    category: "home-garden",
    brand: "BrightLife",
    bestPrice: 35.0,
    bestPricePlatform: "Pinduoduo",
    imageUrl: null,
    platformCount: 4,
    updatedAt: "2026-04-11T16:45:00Z",
  },
  {
    id: "prod-004",
    nameEn: "Mechanical Keyboard RGB 87-Key",
    category: "electronics",
    brand: "KeyMaster",
    bestPrice: 129.0,
    bestPricePlatform: "JD.com",
    imageUrl: null,
    platformCount: 3,
    updatedAt: "2026-04-12T08:20:00Z",
  },
  {
    id: "prod-005",
    nameEn: "Silicone Phone Case Shockproof Clear",
    category: "electronics",
    brand: null,
    bestPrice: 8.8,
    bestPricePlatform: "Pinduoduo",
    imageUrl: null,
    platformCount: 4,
    updatedAt: "2026-04-11T14:00:00Z",
  },
  {
    id: "prod-006",
    nameEn: "Mini Portable Power Bank 10000mAh",
    category: "electronics",
    brand: "ChargeFast",
    bestPrice: 59.9,
    bestPricePlatform: "Taobao",
    imageUrl: null,
    platformCount: 3,
    updatedAt: "2026-04-12T11:00:00Z",
  },
];

const PLATFORM_COLORS: Record<string, string> = {
  Taobao: "bg-orange-100 text-orange-700",
  "JD.com": "bg-red-100 text-red-700",
  "1688": "bg-amber-100 text-amber-700",
  Pinduoduo: "bg-rose-100 text-rose-700",
};

function ProductCard({ product }: { product: ProductListItem }) {
  return (
    <Link
      href={`/product/${product.id}`}
      className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all duration-200"
    >
      <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 flex items-center justify-center relative">
        <svg
          className="h-12 w-12 text-gray-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <span className="absolute top-2 right-2 text-xs font-medium px-2 py-0.5 rounded-full bg-white/80 text-gray-500 backdrop-blur-sm">
          {product.platformCount} platforms
        </span>
      </div>
      <div className="p-4">
        <p className="text-sm font-medium text-gray-900 group-hover:text-primary transition-colors line-clamp-2 leading-snug min-h-[2.5rem]">
          {product.nameEn}
        </p>
        {product.brand && (
          <p className="text-xs text-gray-400 mt-1">{product.brand}</p>
        )}
        <div className="mt-3 flex items-end justify-between">
          <div>
            <span className="text-xl font-bold text-accent">
              ¥{product.bestPrice.toFixed(2)}
            </span>
            <span className="text-xs text-gray-400 ml-1">lowest</span>
          </div>
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${PLATFORM_COLORS[product.bestPricePlatform] ?? "bg-gray-100 text-gray-600"}`}
          >
            {product.bestPricePlatform}
          </span>
        </div>
      </div>
    </Link>
  );
}

const SORT_OPTIONS = [
  { value: "relevance", label: "Relevance" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest First" },
];

const PLATFORMS = ["Taobao", "JD.com", "1688", "Pinduoduo"];

export default function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string; category?: string; sort?: string };
}) {
  const query = searchParams.q ?? "";
  const category = searchParams.category ?? "";
  const sort = searchParams.sort ?? "relevance";

  const results = query || category ? MOCK_PRODUCTS : [];
  const total = results.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <SearchBar initialQuery={query} />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-6">
            <h3 className="font-semibold text-primary text-sm uppercase tracking-wider">
              Filters
            </h3>

            {/* Platform filter */}
            <div>
              <p className="font-medium text-gray-700 mb-2 text-sm">
                Platform
              </p>
              <div className="space-y-2">
                {PLATFORMS.map((p) => (
                  <label key={p} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-gray-900 transition-colors">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded border-gray-300 text-accent focus:ring-accent/30 h-4 w-4"
                    />
                    {p}
                  </label>
                ))}
              </div>
            </div>

            {/* Price range */}
            <div>
              <p className="font-medium text-gray-700 mb-2 text-sm">
                Price Range (CNY)
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30"
                />
                <span className="text-gray-400">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30"
                />
              </div>
            </div>

            {/* Rating */}
            <div>
              <p className="font-medium text-gray-700 mb-2 text-sm">
                Minimum Rating
              </p>
              <div className="space-y-1.5">
                {[4, 3, 2].map((stars) => (
                  <label key={stars} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-gray-900 transition-colors">
                    <input
                      type="radio"
                      name="rating"
                      className="text-accent focus:ring-accent/30 h-4 w-4"
                    />
                    <span className="text-amber-400">
                      {"★".repeat(stars)}
                      {"☆".repeat(5 - stars)}
                    </span>
                    <span className="text-gray-400">&amp; up</span>
                  </label>
                ))}
              </div>
            </div>

            <button className="w-full py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-light transition-colors">
              Apply Filters
            </button>
          </div>
        </aside>

        {/* Main content */}
        <section className="flex-1 min-w-0">
          {query || category ? (
            <>
              {/* Results header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    {total} results
                    {query && (
                      <>
                        {" "}
                        for{" "}
                        <span className="text-accent">
                          &ldquo;{query}&rdquo;
                        </span>
                      </>
                    )}
                    {category && (
                      <span className="text-sm font-normal text-gray-500 ml-2">
                        in {category}
                      </span>
                    )}
                  </h1>
                </div>
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="sort-select"
                    className="text-sm text-gray-500 whitespace-nowrap"
                  >
                    Sort by
                  </label>
                  <select
                    id="sort-select"
                    defaultValue={sort}
                    className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-700 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30"
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Product grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {results.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination placeholder */}
              <div className="mt-8 flex justify-center">
                <div className="flex items-center gap-1">
                  <button
                    disabled
                    className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 text-gray-400 cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button className="px-3 py-1.5 text-sm rounded-lg bg-primary text-white font-medium">
                    1
                  </button>
                  <button className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                    2
                  </button>
                  <button className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                    3
                  </button>
                  <button className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                    Next
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <svg
                className="mx-auto h-16 w-16 text-gray-300 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                />
              </svg>
              <p className="text-lg font-medium text-gray-500">
                Enter a search query to find products
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Compare prices across Taobao, JD.com, 1688, and Pinduoduo
              </p>
            </div>
          )}
        </section>
      </div>

      {/* Compare bar (static) */}
      {(query || category) && (
        <div className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700">
                Compare Products
              </span>
              <div className="flex items-center gap-2">
                {["prod-001", "prod-004"].map((id) => {
                  const p = MOCK_PRODUCTS.find((m) => m.id === id);
                  return (
                    <span
                      key={id}
                      className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary rounded-full px-3 py-1 font-medium"
                    >
                      {p?.nameEn.slice(0, 20)}...
                      <button className="ml-1 text-primary/50 hover:text-primary transition-colors">
                        &times;
                      </button>
                    </span>
                  );
                })}
              </div>
              <span className="text-xs text-gray-400">2 selected</span>
            </div>
            <Link
              href="/compare?ids=prod-001,prod-004"
              className="px-5 py-2 bg-accent text-white text-sm font-semibold rounded-lg hover:bg-accent-dark transition-colors"
            >
              Compare Now
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
