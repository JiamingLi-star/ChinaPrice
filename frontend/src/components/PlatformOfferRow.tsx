import type { PlatformOffer } from '@/types/product';
import PlatformBadge from './PlatformBadge';
import PriceFreshnessTag from './PriceFreshnessTag';

interface PlatformOfferRowProps {
  offer: PlatformOffer;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const fill = Math.min(1, Math.max(0, rating - (star - 1)));
        return (
          <svg key={star} className="h-4 w-4" viewBox="0 0 20 20">
            <defs>
              <linearGradient id={`star-fill-${star}-${rating}`}>
                <stop offset={`${fill * 100}%`} stopColor="#f59e0b" />
                <stop offset={`${fill * 100}%`} stopColor="#d1d5db" />
              </linearGradient>
            </defs>
            <path
              fill={`url(#star-fill-${star}-${rating})`}
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            />
          </svg>
        );
      })}
    </div>
  );
}

function formatPriceType(priceType: string): string {
  const map: Record<string, string> = {
    original: 'Original',
    coupon: 'Coupon',
    'group-buy': 'Group-buy',
    groupbuy: 'Group-buy',
    promotion: 'Promo',
    flash_sale: 'Flash Sale',
  };
  return map[priceType.toLowerCase()] ?? priceType;
}

function sellerAgeLabel(days: number): string {
  const years = Math.floor(days / 365);
  if (years >= 1) return `Seller for ${years} year${years > 1 ? 's' : ''}`;
  const months = Math.floor(days / 30);
  if (months >= 1) return `Seller for ${months} month${months > 1 ? 's' : ''}`;
  return `Seller for ${days} day${days !== 1 ? 's' : ''}`;
}

export default function PlatformOfferRow({ offer }: PlatformOfferRowProps) {
  const hasDiscount = offer.originalPrice !== null && offer.originalPrice > offer.price;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl border border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm transition-all">
      {/* Platform + Title */}
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <PlatformBadge platform={offer.platform} size="md" />
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
            {formatPriceType(offer.priceType)}
          </span>
          <PriceFreshnessTag updatedAt={offer.priceUpdatedAt} />
        </div>
        <p className="text-sm text-gray-800 font-medium line-clamp-2 leading-snug">
          {offer.titleEn}
        </p>
      </div>

      {/* Price */}
      <div className="flex flex-col items-start sm:items-end shrink-0 sm:min-w-[120px]">
        <span className="text-xl font-bold text-accent">
          ¥{offer.price.toLocaleString()}
        </span>
        {hasDiscount && (
          <span className="text-sm text-gray-400 line-through">
            ¥{offer.originalPrice!.toLocaleString()}
          </span>
        )}
        {offer.shippingFee !== null && (
          <span className="text-xs text-gray-400 mt-0.5">
            {offer.shippingFee === 0 ? 'Free shipping' : `+¥${offer.shippingFee} shipping`}
          </span>
        )}
      </div>

      {/* Rating + Stats */}
      <div className="flex flex-col gap-1 shrink-0 sm:min-w-[140px]">
        {offer.rating !== null && (
          <div className="flex items-center gap-1.5">
            <StarRating rating={offer.rating} />
            <span className="text-xs text-gray-500">{offer.rating.toFixed(1)}</span>
          </div>
        )}
        <div className="flex items-center gap-3 text-xs text-gray-400">
          {offer.reviewCount !== null && (
            <span>{offer.reviewCount.toLocaleString()} reviews</span>
          )}
          {offer.salesCount !== null && (
            <span>{offer.salesCount.toLocaleString()} sold</span>
          )}
        </div>
      </div>

      {/* Seller */}
      <div className="flex flex-col gap-1 shrink-0 sm:min-w-[120px]">
        {offer.sellerName && (
          <span className="text-xs text-gray-600 font-medium truncate max-w-[140px]">
            {offer.sellerName}
          </span>
        )}
        {offer.sellerAgeDays !== null && (
          <span className="inline-flex items-center text-xs text-gray-400">
            <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            {sellerAgeLabel(offer.sellerAgeDays)}
          </span>
        )}
      </div>

      {/* Visit button */}
      <a
        href={offer.url}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-light transition-colors"
      >
        Visit
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
        </svg>
      </a>
    </div>
  );
}
