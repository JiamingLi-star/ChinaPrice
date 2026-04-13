import Link from "next/link";

import type { Product, ProductListItem } from "@/types/product";

const PLATFORM_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Taobao: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
  "JD.com": { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
  "1688": { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  Pinduoduo: { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200" },
};

function getMockProduct(id: string): Product {
  return {
    id,
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
      Connectivity: "Bluetooth 5.3, AAC/SBC",
      Weight: "5.2g per earbud",
      "Noise Cancellation": "Active (ANC)",
      "Charging Port": "USB-C",
    },
    platformOffers: [
      {
        id: "offer-1",
        platform: "1688",
        platformProductId: "1688-abc-001",
        titleEn: "TWS Bluetooth 5.3 Earbuds ANC Wireless Earphones",
        url: "https://detail.1688.com/offer/123456.html",
        price: 45.9,
        priceType: "unit",
        originalPrice: 89.0,
        shippingFee: 0,
        rating: 4.7,
        reviewCount: 2340,
        salesCount: 15800,
        sellerName: "Shenzhen Audio Factory",
        sellerAgeDays: 1825,
        specsEn: { Color: "Black", Style: "In-ear" },
        imageUrl: null,
        status: "active",
        priceUpdatedAt: "2026-04-12T10:30:00Z",
      },
      {
        id: "offer-2",
        platform: "Taobao",
        platformProductId: "tb-xyz-002",
        titleEn: "SoundPro Wireless Earbuds Bluetooth 5.3 TWS",
        url: "https://item.taobao.com/item.htm?id=654321",
        price: 49.9,
        priceType: "unit",
        originalPrice: 99.0,
        shippingFee: 0,
        rating: 4.8,
        reviewCount: 5670,
        salesCount: 32100,
        sellerName: "SoundPro Official Store",
        sellerAgeDays: 2555,
        specsEn: { Color: "Black", Style: "In-ear" },
        imageUrl: null,
        status: "active",
        priceUpdatedAt: "2026-04-12T08:15:00Z",
      },
      {
        id: "offer-3",
        platform: "JD.com",
        platformProductId: "jd-qwe-003",
        titleEn: "SoundPro SP-TWS Pro Wireless Bluetooth Earbuds",
        url: "https://item.jd.com/100045678.html",
        price: 68.0,
        priceType: "unit",
        originalPrice: 99.0,
        shippingFee: 0,
        rating: 4.9,
        reviewCount: 12450,
        salesCount: 56000,
        sellerName: "SoundPro JD Flagship",
        sellerAgeDays: 3650,
        specsEn: { Color: "Black", Style: "In-ear" },
        imageUrl: null,
        status: "active",
        priceUpdatedAt: "2026-04-12T07:00:00Z",
      },
      {
        id: "offer-4",
        platform: "Pinduoduo",
        platformProductId: "pdd-rty-004",
        titleEn: "Wireless Earbuds Bluetooth TWS Sport Earphones",
        url: "https://mobile.yangkeduo.com/goods.html?goods_id=789012",
        price: 39.9,
        priceType: "group_buy",
        originalPrice: 79.0,
        shippingFee: 5.0,
        rating: 4.5,
        reviewCount: 890,
        salesCount: 8900,
        sellerName: "Digital Deals Store",
        sellerAgeDays: 730,
        specsEn: { Color: "White", Style: "In-ear" },
        imageUrl: null,
        status: "active",
        priceUpdatedAt: "2026-04-11T22:00:00Z",
      },
    ],
    updatedAt: "2026-04-12T10:30:00Z",
  };
}

const RELATED_PRODUCTS: ProductListItem[] = [
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

function FreshnessTag({ dateStr }: { dateStr: string }) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diffMs / 3_600_000);
  if (hours < 1)
    return (
      <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 rounded-full px-2 py-0.5 font-medium">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
        Just now
      </span>
    );
  if (hours < 24)
    return (
      <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 rounded-full px-2 py-0.5 font-medium">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
        {hours}h ago
      </span>
    );
  const days = Math.floor(hours / 24);
  if (days < 3)
    return (
      <span className="inline-flex items-center gap-1 text-xs text-amber-600 bg-amber-50 rounded-full px-2 py-0.5 font-medium">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
        {days}d ago
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 text-xs text-red-600 bg-red-50 rounded-full px-2 py-0.5 font-medium">
      <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
      {days}d ago
    </span>
  );
}

function PriceHistoryChartPlaceholder() {
  const points = [65, 60, 62, 55, 52, 49, 51, 48, 45, 46, 45, 44];
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const width = 100;
  const height = 40;
  const pathData = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * width;
      const y = height - ((p - min) / range) * (height - 4) - 2;
      return `${i === 0 ? "M" : "L"}${x},${y}`;
    })
    .join(" ");

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Price History (Best Price)
      </h2>
      <div className="flex items-center gap-6 mb-4">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wider">Current Low</p>
          <p className="text-xl font-bold text-accent">¥45.90</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wider">30-Day Avg</p>
          <p className="text-xl font-bold text-gray-700">¥52.30</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wider">All-Time Low</p>
          <p className="text-xl font-bold text-green-600">¥39.90</p>
        </div>
      </div>
      <div className="relative h-48 bg-gradient-to-b from-primary/5 to-transparent rounded-lg flex items-end p-4">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0f3460" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#0f3460" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          <path d={`${pathData} L${width},${height} L0,${height} Z`} fill="url(#chartGrad)" />
          <path d={pathData} fill="none" stroke="#0f3460" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div className="absolute bottom-2 left-4 right-4 flex justify-between text-[10px] text-gray-400">
          <span>12 months ago</span>
          <span>6 months ago</span>
          <span>Today</span>
        </div>
      </div>
      <p className="text-xs text-gray-400 mt-3 text-center">
        Historical price data is updated daily. Chart powered by PriceHistoryChart component.
      </p>
    </div>
  );
}

function ReportSection({ productId }: { productId: string }) {
  const issues = [
    { value: "wrong_price", label: "Wrong price displayed" },
    { value: "wrong_match", label: "Wrong product matched" },
    { value: "broken_link", label: "Broken link to platform" },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Report an Issue
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        Found incorrect data? Help us improve by reporting it.
      </p>
      <form className="space-y-4">
        <input type="hidden" name="product_id" value={productId} />
        <div className="space-y-2">
          {issues.map((issue) => (
            <label
              key={issue.value}
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-primary/20 hover:bg-primary/5 transition-all cursor-pointer"
            >
              <input
                type="radio"
                name="feedback_type"
                value={issue.value}
                className="text-accent focus:ring-accent/30 h-4 w-4"
              />
              <span className="text-sm text-gray-700">{issue.label}</span>
            </label>
          ))}
        </div>
        <textarea
          name="details"
          placeholder="Additional details (optional)..."
          rows={3}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 resize-none"
        />
        <button
          type="button"
          className="px-5 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-light transition-colors"
        >
          Submit Report
        </button>
      </form>
    </div>
  );
}

export default function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const product = getMockProduct(id);

  const sortedOffers = [...product.platformOffers].sort(
    (a, b) => a.price + (a.shippingFee ?? 0) - (b.price + (b.shippingFee ?? 0)),
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/search" className="hover:text-primary transition-colors">
          Search
        </Link>
        <span>/</span>
        <Link
          href={`/search?category=${product.category.toLowerCase()}`}
          className="hover:text-primary transition-colors"
        >
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-gray-600 truncate max-w-[200px]">
          {product.nameEn}
        </span>
      </nav>

      {/* Product header */}
      <div className="grid lg:grid-cols-2 gap-8 mb-10">
        {/* Image placeholder */}
        <div className="aspect-square bg-gradient-to-br from-primary/5 via-gray-50 to-accent/5 rounded-2xl flex items-center justify-center border border-gray-100">
          <div className="text-center">
            <svg
              className="mx-auto h-24 w-24 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={0.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-sm text-gray-400 mt-2">Product Image</p>
          </div>
        </div>

        {/* Product info */}
        <div>
          <div className="mb-1">
            {product.brand && (
              <p className="text-sm font-medium text-primary/70 uppercase tracking-wider">
                {product.brand}
              </p>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
            {product.nameEn}
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Category: {product.category}
          </p>

          {/* Best price highlight */}
          <div className="mt-6 bg-gradient-to-r from-accent/10 to-accent/5 rounded-xl p-5 border border-accent/20">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
              Best Price Available
            </p>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-accent">
                ¥{product.bestPrice.toFixed(2)}
              </span>
              <span className="text-sm text-gray-500">
                on {product.bestPricePlatform}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Compared across {product.platformOffers.length} platforms
            </p>
          </div>

          {/* Quick specs */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Key Specifications
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(product.attributesEn)
                .slice(0, 6)
                .map(([key, val]) => (
                  <div key={key} className="text-sm">
                    <span className="text-gray-400">{key}:</span>{" "}
                    <span className="text-gray-700 font-medium">{val}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Platform offers */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Price Comparison Across Platforms
        </h2>
        <div className="space-y-3">
          {sortedOffers.map((offer, idx) => {
            const colors = PLATFORM_COLORS[offer.platform] ?? {
              bg: "bg-gray-50",
              text: "text-gray-700",
              border: "border-gray-200",
            };
            const totalPrice = offer.price + (offer.shippingFee ?? 0);
            const isBest = idx === 0;
            return (
              <div
                key={offer.id}
                className={`relative flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl border transition-all ${isBest ? `${colors.border} ${colors.bg} ring-1 ring-offset-0 ring-accent/20` : "border-gray-100 hover:border-gray-200 hover:bg-gray-50/50"}`}
              >
                {isBest && (
                  <span className="absolute -top-2.5 left-4 text-[10px] font-bold uppercase tracking-wider bg-accent text-white px-2 py-0.5 rounded-full">
                    Best Price
                  </span>
                )}
                <div className="sm:w-28 shrink-0">
                  <span
                    className={`inline-block text-sm font-semibold px-3 py-1 rounded-lg ${colors.bg} ${colors.text}`}
                  >
                    {offer.platform}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700 font-medium truncate">
                    {offer.titleEn}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-gray-400">
                    {offer.sellerName && <span>{offer.sellerName}</span>}
                    {offer.rating && (
                      <span className="flex items-center gap-0.5">
                        <span className="text-amber-400">★</span> {offer.rating}
                        {offer.reviewCount && (
                          <span className="text-gray-300">
                            ({offer.reviewCount.toLocaleString()})
                          </span>
                        )}
                      </span>
                    )}
                    {offer.salesCount && (
                      <span>
                        {offer.salesCount.toLocaleString()} sold
                      </span>
                    )}
                    <FreshnessTag dateStr={offer.priceUpdatedAt} />
                  </div>
                </div>

                <div className="flex items-center gap-4 sm:text-right">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span
                        className={`text-xl font-bold ${isBest ? "text-accent" : "text-gray-900"}`}
                      >
                        ¥{offer.price.toFixed(2)}
                      </span>
                      {offer.originalPrice && (
                        <span className="text-sm text-gray-400 line-through">
                          ¥{offer.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {offer.shippingFee
                        ? `+¥${offer.shippingFee.toFixed(2)} shipping = ¥${totalPrice.toFixed(2)}`
                        : "Free shipping"}
                      {offer.priceType === "group_buy" && (
                        <span className="ml-2 text-accent font-medium">
                          Group buy
                        </span>
                      )}
                    </div>
                  </div>
                  <a
                    href={offer.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-light transition-colors"
                  >
                    View
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Full specs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Full Specifications
        </h2>
        <div className="divide-y divide-gray-100">
          {Object.entries(product.attributesEn).map(([key, val], idx) => (
            <div
              key={key}
              className={`flex py-3 text-sm ${idx % 2 === 0 ? "bg-gray-50/50" : ""} -mx-2 px-2 rounded`}
            >
              <span className="w-44 shrink-0 text-gray-500 font-medium">
                {key}
              </span>
              <span className="text-gray-900">{val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Price history chart */}
      <div className="mb-8">
        <PriceHistoryChartPlaceholder />
      </div>

      {/* Report section */}
      <div className="mb-12">
        <ReportSection productId={id} />
      </div>

      {/* Related products */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-5">
          Related Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {RELATED_PRODUCTS.map((rp) => (
            <Link
              key={rp.id}
              href={`/product/${rp.id}`}
              className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all duration-200"
            >
              <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 flex items-center justify-center">
                <svg
                  className="h-10 w-10 text-gray-300"
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
              <div className="p-4">
                <p className="text-sm font-medium text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                  {rp.nameEn}
                </p>
                {rp.brand && (
                  <p className="text-xs text-gray-400 mt-1">{rp.brand}</p>
                )}
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-lg font-bold text-accent">
                    ¥{rp.bestPrice.toFixed(2)}
                  </span>
                  <span className="text-xs text-gray-400">
                    {rp.platformCount} platforms
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
