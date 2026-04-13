import Link from "next/link";

import type { Category } from "@/types/product";

const MOCK_CATEGORIES: (Category & { icon: string; description: string; color: string })[] = [
  {
    slug: "electronics",
    name: "Electronics",
    productCount: 1520,
    icon: "⚡",
    description: "Smartphones, laptops, gadgets & accessories",
    color: "from-blue-500 to-indigo-600",
  },
  {
    slug: "home-garden",
    name: "Home & Garden",
    productCount: 890,
    icon: "🏠",
    description: "Furniture, decor, kitchen & outdoor",
    color: "from-emerald-500 to-teal-600",
  },
  {
    slug: "fashion",
    name: "Fashion",
    productCount: 2340,
    icon: "👗",
    description: "Clothing, shoes, bags & jewelry",
    color: "from-pink-500 to-rose-600",
  },
  {
    slug: "beauty",
    name: "Beauty & Health",
    productCount: 1150,
    icon: "✨",
    description: "Skincare, makeup, supplements & wellness",
    color: "from-purple-500 to-violet-600",
  },
  {
    slug: "sports",
    name: "Sports & Outdoors",
    productCount: 670,
    icon: "🏃",
    description: "Fitness gear, camping, cycling & outdoor",
    color: "from-orange-500 to-amber-600",
  },
  {
    slug: "toys",
    name: "Toys & Hobbies",
    productCount: 980,
    icon: "🎮",
    description: "Games, RC vehicles, puzzles & collectibles",
    color: "from-cyan-500 to-sky-600",
  },
  {
    slug: "automotive",
    name: "Automotive",
    productCount: 430,
    icon: "🚗",
    description: "Car accessories, parts & maintenance",
    color: "from-gray-600 to-slate-700",
  },
  {
    slug: "office",
    name: "Office & School",
    productCount: 560,
    icon: "📦",
    description: "Stationery, printers, storage & supplies",
    color: "from-yellow-500 to-orange-500",
  },
  {
    slug: "baby-kids",
    name: "Baby & Kids",
    productCount: 740,
    icon: "🍼",
    description: "Clothing, feeding, toys & safety",
    color: "from-lime-500 to-green-600",
  },
];

export default function CategoriesPage() {
  const totalProducts = MOCK_CATEGORIES.reduce(
    (sum, c) => sum + c.productCount,
    0,
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900">
          Browse Categories
        </h1>
        <p className="text-gray-500 mt-2">
          Explore {totalProducts.toLocaleString()} products across{" "}
          {MOCK_CATEGORIES.length} categories
        </p>
      </div>

      {/* Category grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_CATEGORIES.map((cat) => (
          <Link
            key={cat.slug}
            href={`/search?category=${cat.slug}`}
            className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all duration-300"
          >
            {/* Gradient accent bar */}
            <div
              className={`h-2 bg-gradient-to-r ${cat.color}`}
            />

            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{cat.icon}</span>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors">
                      {cat.name}
                    </h2>
                    <p className="text-sm text-gray-400 mt-0.5">
                      {cat.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-primary">
                    {cat.productCount.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-400">products</span>
                </div>
                <span className="inline-flex items-center gap-1 text-sm text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Browse
                  <svg
                    className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Stats bar */}
      <div className="mt-12 bg-gradient-to-r from-primary to-primary-light rounded-2xl p-8 text-white">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-3xl font-bold">
              {totalProducts.toLocaleString()}
            </p>
            <p className="text-sm text-blue-200 mt-1">Products Tracked</p>
          </div>
          <div>
            <p className="text-3xl font-bold">4</p>
            <p className="text-sm text-blue-200 mt-1">Platforms Compared</p>
          </div>
          <div>
            <p className="text-3xl font-bold">24/7</p>
            <p className="text-sm text-blue-200 mt-1">Price Monitoring</p>
          </div>
        </div>
      </div>
    </div>
  );
}
