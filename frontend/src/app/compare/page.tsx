import Link from "next/link";

import type { Product } from "@/types/product";

const MOCK_COMPARE_PRODUCTS: Product[] = [
  {
    id: "prod-001",
    nameEn: "Wireless Bluetooth Earbuds TWS Pro",
    nameZh: null,
    category: "Electronics",
    brand: "SoundPro",
    bestPrice: 45.9,
    bestPricePlatform: "1688",
    attributesEn: {
      "Bluetooth Version": "5.3",
      "Battery Life": "6h (30h with case)",
      "Driver Size": "13mm",
      "Water Resistance": "IPX5",
      "Noise Cancellation": "ANC",
      "Charging Port": "USB-C",
      Weight: "5.2g per earbud",
    },
    platformOffers: [
      {
        id: "o1",
        platform: "1688",
        platformProductId: "1688-abc",
        titleEn: "TWS Bluetooth Earbuds",
        url: "#",
        price: 45.9,
        priceType: "unit",
        originalPrice: 89.0,
        shippingFee: 0,
        rating: 4.7,
        reviewCount: 2340,
        salesCount: 15800,
        sellerName: "Shenzhen Audio",
        sellerAgeDays: 1825,
        specsEn: {},
        imageUrl: null,
        status: "active",
        priceUpdatedAt: "2026-04-12T10:30:00Z",
      },
      {
        id: "o2",
        platform: "Taobao",
        platformProductId: "tb-abc",
        titleEn: "SoundPro TWS Earbuds",
        url: "#",
        price: 49.9,
        priceType: "unit",
        originalPrice: 99.0,
        shippingFee: 0,
        rating: 4.8,
        reviewCount: 5670,
        salesCount: 32100,
        sellerName: "SoundPro Official",
        sellerAgeDays: 2555,
        specsEn: {},
        imageUrl: null,
        status: "active",
        priceUpdatedAt: "2026-04-12T08:15:00Z",
      },
    ],
    updatedAt: "2026-04-12T10:30:00Z",
  },
  {
    id: "prod-007",
    nameEn: "Noise Cancelling Over-Ear Headphones",
    nameZh: null,
    category: "Electronics",
    brand: "AudioMax",
    bestPrice: 89.0,
    bestPricePlatform: "Taobao",
    attributesEn: {
      "Bluetooth Version": "5.2",
      "Battery Life": "40h",
      "Driver Size": "40mm",
      "Water Resistance": "None",
      "Noise Cancellation": "ANC + Transparency",
      "Charging Port": "USB-C",
      Weight: "250g",
    },
    platformOffers: [
      {
        id: "o3",
        platform: "Taobao",
        platformProductId: "tb-xyz",
        titleEn: "AudioMax Over-Ear ANC Headphones",
        url: "#",
        price: 89.0,
        priceType: "unit",
        originalPrice: 159.0,
        shippingFee: 0,
        rating: 4.6,
        reviewCount: 1890,
        salesCount: 9800,
        sellerName: "AudioMax Store",
        sellerAgeDays: 1460,
        specsEn: {},
        imageUrl: null,
        status: "active",
        priceUpdatedAt: "2026-04-12T09:00:00Z",
      },
      {
        id: "o4",
        platform: "JD.com",
        platformProductId: "jd-xyz",
        titleEn: "AudioMax NC Headphones Pro",
        url: "#",
        price: 109.0,
        priceType: "unit",
        originalPrice: 179.0,
        shippingFee: 0,
        rating: 4.8,
        reviewCount: 4560,
        salesCount: 22000,
        sellerName: "AudioMax JD Flagship",
        sellerAgeDays: 2190,
        specsEn: {},
        imageUrl: null,
        status: "active",
        priceUpdatedAt: "2026-04-12T07:30:00Z",
      },
    ],
    updatedAt: "2026-04-12T09:00:00Z",
  },
  {
    id: "prod-008",
    nameEn: "Sports Wireless Earphones Neckband",
    nameZh: null,
    category: "Electronics",
    brand: "FitSound",
    bestPrice: 29.9,
    bestPricePlatform: "Pinduoduo",
    attributesEn: {
      "Bluetooth Version": "5.1",
      "Battery Life": "12h",
      "Driver Size": "10mm",
      "Water Resistance": "IPX6",
      "Noise Cancellation": "None",
      "Charging Port": "Micro-USB",
      Weight: "28g",
    },
    platformOffers: [
      {
        id: "o5",
        platform: "Pinduoduo",
        platformProductId: "pdd-nnn",
        titleEn: "FitSound Neckband Sports Earphones",
        url: "#",
        price: 29.9,
        priceType: "group_buy",
        originalPrice: 59.0,
        shippingFee: 3.0,
        rating: 4.4,
        reviewCount: 670,
        salesCount: 5400,
        sellerName: "FitSound Direct",
        sellerAgeDays: 365,
        specsEn: {},
        imageUrl: null,
        status: "active",
        priceUpdatedAt: "2026-04-11T20:00:00Z",
      },
    ],
    updatedAt: "2026-04-11T20:00:00Z",
  },
];

const PLATFORM_BADGE: Record<string, string> = {
  Taobao: "bg-orange-100 text-orange-700",
  "JD.com": "bg-red-100 text-red-700",
  "1688": "bg-amber-100 text-amber-700",
  Pinduoduo: "bg-rose-100 text-rose-700",
};

export default function ComparePage({
  searchParams,
}: {
  searchParams: { ids?: string };
}) {
  const ids = searchParams.ids?.split(",").filter(Boolean) ?? [];

  const products =
    ids.length > 0
      ? MOCK_COMPARE_PRODUCTS.filter((p) => ids.includes(p.id))
      : MOCK_COMPARE_PRODUCTS;

  const allAttrKeys = Array.from(
    new Set(products.flatMap((p) => Object.keys(p.attributesEn))),
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <Link
            href="/search"
            className="text-sm text-primary hover:text-primary-light transition-colors inline-flex items-center gap-1 mb-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Search
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            Compare Products
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Comparing {products.length} product
            {products.length !== 1 ? "s" : ""} side by side
          </p>
        </div>
        <Link
          href="/search"
          className="inline-flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:border-primary hover:text-primary transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add More Products
        </Link>
      </div>

      {/* Comparison table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr>
                <th className="w-44 p-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-50 border-b border-gray-100 sticky left-0 z-10">
                  Feature
                </th>
                {products.map((p) => (
                  <th
                    key={p.id}
                    className="p-4 text-left border-b border-gray-100 bg-gray-50 min-w-[200px]"
                  >
                    <div className="space-y-2">
                      <div className="aspect-[3/2] bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 rounded-lg flex items-center justify-center mb-3">
                        <svg
                          className="h-8 w-8 text-gray-300"
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
                      </div>
                      <Link
                        href={`/product/${p.id}`}
                        className="text-sm font-semibold text-gray-900 hover:text-primary transition-colors line-clamp-2 block"
                      >
                        {p.nameEn}
                      </Link>
                      {p.brand && (
                        <p className="text-xs text-gray-400">{p.brand}</p>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Price row */}
              <tr className="bg-accent/5">
                <td className="p-4 text-sm font-semibold text-gray-700 sticky left-0 z-10 bg-accent/5 border-b border-gray-100">
                  Best Price
                </td>
                {products.map((p) => {
                  const cheapest = products.reduce(
                    (min, curr) =>
                      curr.bestPrice < min.bestPrice ? curr : min,
                    products[0],
                  );
                  const isCheapest = p.id === cheapest.id;
                  return (
                    <td
                      key={p.id}
                      className="p-4 border-b border-gray-100"
                    >
                      <span
                        className={`text-xl font-bold ${isCheapest ? "text-accent" : "text-gray-900"}`}
                      >
                        ¥{p.bestPrice.toFixed(2)}
                      </span>
                      {isCheapest && (
                        <span className="ml-2 text-[10px] font-bold uppercase tracking-wider bg-accent text-white px-2 py-0.5 rounded-full">
                          Lowest
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>

              {/* Platform row */}
              <tr>
                <td className="p-4 text-sm font-medium text-gray-500 sticky left-0 z-10 bg-white border-b border-gray-100">
                  Best Platform
                </td>
                {products.map((p) => (
                  <td
                    key={p.id}
                    className="p-4 border-b border-gray-100"
                  >
                    <span
                      className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-lg ${PLATFORM_BADGE[p.bestPricePlatform] ?? "bg-gray-100 text-gray-600"}`}
                    >
                      {p.bestPricePlatform}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Offers count row */}
              <tr>
                <td className="p-4 text-sm font-medium text-gray-500 sticky left-0 z-10 bg-gray-50/50 border-b border-gray-100">
                  Available On
                </td>
                {products.map((p) => (
                  <td
                    key={p.id}
                    className="p-4 border-b border-gray-100 bg-gray-50/50"
                  >
                    <span className="text-sm text-gray-700">
                      {p.platformOffers.length} platform
                      {p.platformOffers.length !== 1 ? "s" : ""}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Attribute rows */}
              {allAttrKeys.map((key, idx) => (
                <tr key={key}>
                  <td
                    className={`p-4 text-sm font-medium text-gray-500 sticky left-0 z-10 border-b border-gray-100 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
                  >
                    {key}
                  </td>
                  {products.map((p) => {
                    const val = p.attributesEn[key];
                    return (
                      <td
                        key={p.id}
                        className={`p-4 text-sm border-b border-gray-100 ${idx % 2 === 0 ? "" : "bg-gray-50/50"}`}
                      >
                        {val ? (
                          <span className="text-gray-800">{val}</span>
                        ) : (
                          <span className="text-gray-300">&mdash;</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}

              {/* Rating row */}
              <tr>
                <td className="p-4 text-sm font-medium text-gray-500 sticky left-0 z-10 bg-white border-b border-gray-100">
                  Top Rating
                </td>
                {products.map((p) => {
                  const topOffer = p.platformOffers.reduce(
                    (best, o) =>
                      (o.rating ?? 0) > (best.rating ?? 0) ? o : best,
                    p.platformOffers[0],
                  );
                  return (
                    <td
                      key={p.id}
                      className="p-4 border-b border-gray-100"
                    >
                      {topOffer.rating ? (
                        <div className="flex items-center gap-1">
                          <span className="text-amber-400">★</span>
                          <span className="text-sm font-medium text-gray-700">
                            {topOffer.rating}
                          </span>
                          {topOffer.reviewCount && (
                            <span className="text-xs text-gray-400">
                              ({topOffer.reviewCount.toLocaleString()} reviews)
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-300">&mdash;</span>
                      )}
                    </td>
                  );
                })}
              </tr>

              {/* Action row */}
              <tr>
                <td className="p-4 sticky left-0 z-10 bg-gray-50" />
                {products.map((p) => (
                  <td key={p.id} className="p-4 bg-gray-50">
                    <Link
                      href={`/product/${p.id}`}
                      className="inline-block px-5 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-light transition-colors w-full text-center"
                    >
                      View Details
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Price comparison summary */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-5">
        {products.map((p) => {
          const offers = [...p.platformOffers].sort(
            (a, b) =>
              a.price + (a.shippingFee ?? 0) - (b.price + (b.shippingFee ?? 0)),
          );
          return (
            <div
              key={p.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-5"
            >
              <p className="text-sm font-semibold text-gray-900 line-clamp-1 mb-3">
                {p.nameEn}
              </p>
              <div className="space-y-2">
                {offers.map((o, idx) => {
                  const badge =
                    PLATFORM_BADGE[o.platform] ?? "bg-gray-100 text-gray-600";
                  return (
                    <div
                      key={o.id}
                      className={`flex items-center justify-between text-sm p-2 rounded-lg ${idx === 0 ? "bg-accent/5" : ""}`}
                    >
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded ${badge}`}
                      >
                        {o.platform}
                      </span>
                      <span
                        className={`font-semibold ${idx === 0 ? "text-accent" : "text-gray-700"}`}
                      >
                        ¥{o.price.toFixed(2)}
                        {o.shippingFee ? (
                          <span className="text-xs text-gray-400 font-normal ml-1">
                            +¥{o.shippingFee.toFixed(2)}
                          </span>
                        ) : null}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
