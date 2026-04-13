import Link from "next/link";

const TRENDING_CATEGORIES = [
  {
    name: "Electronics",
    slug: "electronics",
    description: "Smartphones, laptops, gadgets & accessories",
    icon: "⚡",
  },
  {
    name: "Home & Garden",
    slug: "home-garden",
    description: "Furniture, decor, kitchen & outdoor",
    icon: "🏠",
  },
  {
    name: "Fashion",
    slug: "fashion",
    description: "Clothing, shoes, bags & jewelry",
    icon: "👗",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="bg-gradient-to-br from-primary to-primary-light py-24 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Find the Best Prices Across
            <br />
            {"China's E-commerce"}
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto">
            Compare products from Taobao, JD.com, 1688, and Pinduoduo &mdash;
            all in English
          </p>

          <form
            action="/search"
            method="GET"
            className="mt-10 flex items-center max-w-xl mx-auto"
          >
            <input
              type="text"
              name="q"
              placeholder="Search for any product..."
              className="flex-1 px-5 py-3 rounded-l-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-accent hover:bg-accent-dark text-white font-semibold rounded-r-lg transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-10">
          Trending Categories
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {TRENDING_CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/search?category=${cat.slug}`}
              className="group block bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-primary/20 transition-all"
            >
              <span className="text-3xl">{cat.icon}</span>
              <h3 className="mt-3 text-lg font-semibold text-primary group-hover:text-primary-light transition-colors">
                {cat.name}
              </h3>
              <p className="mt-1 text-sm text-gray-500">{cat.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
