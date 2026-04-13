import type { Product } from '@/types/product';
import PlatformBadge from './PlatformBadge';

interface ComparisonTableProps {
  products: Product[];
}

function bestIndex(values: (number | null)[], mode: 'min' | 'max'): number | null {
  let best: number | null = null;
  let bestIdx: number | null = null;
  for (let i = 0; i < values.length; i++) {
    const v = values[i];
    if (v === null) continue;
    if (best === null || (mode === 'min' ? v < best : v > best)) {
      best = v;
      bestIdx = i;
    }
  }
  return bestIdx;
}

function Cell({
  children,
  highlight = false,
}: {
  children: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <td
      className={`px-4 py-3 text-sm ${
        highlight ? 'bg-green-50 font-semibold text-green-700' : 'text-gray-700'
      }`}
    >
      {children}
    </td>
  );
}

export default function ComparisonTable({ products }: ComparisonTableProps) {
  const items = products.slice(0, 5);

  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400 text-sm">
        No products selected for comparison.
      </div>
    );
  }

  const allSpecKeys = Array.from(
    new Set(
      items.flatMap((p) => [
        ...Object.keys(p.attributesEn),
        ...p.platformOffers.flatMap((o) => Object.keys(o.specsEn)),
      ]),
    ),
  );

  const bestPriceIdx = bestIndex(
    items.map((p) => p.bestPrice),
    'min',
  );

  const avgRatings = items.map((p) => {
    const rated = p.platformOffers.filter((o) => o.rating !== null);
    if (rated.length === 0) return null;
    return rated.reduce((sum, o) => sum + (o.rating ?? 0), 0) / rated.length;
  });
  const bestRatingIdx = bestIndex(avgRatings, 'max');

  const totalReviews = items.map((p) =>
    p.platformOffers.reduce((s, o) => s + (o.reviewCount ?? 0), 0),
  );
  const bestReviewIdx = bestIndex(totalReviews, 'max');

  const totalSales = items.map((p) =>
    p.platformOffers.reduce((s, o) => s + (o.salesCount ?? 0), 0),
  );
  const bestSalesIdx = bestIndex(totalSales, 'max');

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-sm">
      <table className="w-full border-collapse min-w-[600px]">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/60">
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-36">
              Attribute
            </th>
            {items.map((p) => (
              <th key={p.id} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {p.nameEn.length > 30 ? `${p.nameEn.slice(0, 30)}...` : p.nameEn}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {/* Image */}
          <tr>
            <td className="px-4 py-3 text-xs font-medium text-gray-500">Image</td>
            {items.map((p) => (
              <td key={p.id} className="px-4 py-3">
                {p.platformOffers[0]?.imageUrl ? (
                  <img
                    src={p.platformOffers[0].imageUrl}
                    alt={p.nameEn}
                    className="h-20 w-20 rounded-lg object-cover bg-gray-100"
                  />
                ) : (
                  <div className="h-20 w-20 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10" />
                )}
              </td>
            ))}
          </tr>

          {/* Name */}
          <tr>
            <td className="px-4 py-3 text-xs font-medium text-gray-500">Name</td>
            {items.map((p) => (
              <Cell key={p.id}>{p.nameEn}</Cell>
            ))}
          </tr>

          {/* Brand */}
          <tr>
            <td className="px-4 py-3 text-xs font-medium text-gray-500">Brand</td>
            {items.map((p) => (
              <Cell key={p.id}>{p.brand ?? '-'}</Cell>
            ))}
          </tr>

          {/* Category */}
          <tr>
            <td className="px-4 py-3 text-xs font-medium text-gray-500">Category</td>
            {items.map((p) => (
              <Cell key={p.id}>{p.category}</Cell>
            ))}
          </tr>

          {/* Best Price */}
          <tr>
            <td className="px-4 py-3 text-xs font-medium text-gray-500">Best Price</td>
            {items.map((p, i) => (
              <Cell key={p.id} highlight={i === bestPriceIdx}>
                ¥{p.bestPrice.toLocaleString()}
              </Cell>
            ))}
          </tr>

          {/* Platform */}
          <tr>
            <td className="px-4 py-3 text-xs font-medium text-gray-500">Best Platform</td>
            {items.map((p) => (
              <td key={p.id} className="px-4 py-3">
                <PlatformBadge platform={p.bestPricePlatform} />
              </td>
            ))}
          </tr>

          {/* Rating */}
          <tr>
            <td className="px-4 py-3 text-xs font-medium text-gray-500">Avg Rating</td>
            {items.map((p, i) => (
              <Cell key={p.id} highlight={i === bestRatingIdx}>
                {avgRatings[i] !== null ? `${avgRatings[i]!.toFixed(1)} / 5` : '-'}
              </Cell>
            ))}
          </tr>

          {/* Reviews */}
          <tr>
            <td className="px-4 py-3 text-xs font-medium text-gray-500">Reviews</td>
            {items.map((p, i) => (
              <Cell key={p.id} highlight={i === bestReviewIdx}>
                {totalReviews[i].toLocaleString()}
              </Cell>
            ))}
          </tr>

          {/* Sales */}
          <tr>
            <td className="px-4 py-3 text-xs font-medium text-gray-500">Sales</td>
            {items.map((p, i) => (
              <Cell key={p.id} highlight={i === bestSalesIdx}>
                {totalSales[i].toLocaleString()}
              </Cell>
            ))}
          </tr>

          {/* Spec rows */}
          {allSpecKeys.map((key) => (
            <tr key={key}>
              <td className="px-4 py-3 text-xs font-medium text-gray-500 capitalize">
                {key.replace(/_/g, ' ')}
              </td>
              {items.map((p) => {
                const val =
                  p.attributesEn[key] ??
                  p.platformOffers.find((o) => o.specsEn[key])?.specsEn[key] ??
                  '-';
                return <Cell key={p.id}>{val}</Cell>;
              })}
            </tr>
          ))}

          {/* Visit buttons */}
          <tr>
            <td className="px-4 py-3 text-xs font-medium text-gray-500">Links</td>
            {items.map((p) => (
              <td key={p.id} className="px-4 py-3">
                <div className="flex flex-col gap-1.5">
                  {p.platformOffers.map((o) => (
                    <a
                      key={o.id}
                      href={o.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary-light transition-colors"
                    >
                      <PlatformBadge platform={o.platform} size="sm" />
                      <span className="underline underline-offset-2">Visit</span>
                    </a>
                  ))}
                </div>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
