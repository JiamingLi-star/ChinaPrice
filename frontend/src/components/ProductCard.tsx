'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { ProductListItem } from '@/types/product';
import PlatformBadge from './PlatformBadge';
import PriceFreshnessTag from './PriceFreshnessTag';

const CNY_TO_USD = 7.2;

interface ProductCardProps {
  product: ProductListItem;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [checked, setChecked] = useState(false);
  const usdEstimate = (product.bestPrice / CNY_TO_USD).toFixed(2);

  return (
    <div className="group relative bg-white rounded-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-gray-200/60 hover:-translate-y-0.5">
      {/* Compare checkbox */}
      <label className="absolute top-3 right-3 z-10 flex items-center gap-1.5 cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={() => setChecked(!checked)}
          className="h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent/40 cursor-pointer"
        />
        <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
          Compare
        </span>
      </label>

      <Link href={`/product/${product.id}`} className="block">
        {/* Image */}
        <div className="aspect-square w-full overflow-hidden bg-gray-50">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.nameEn}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 flex items-center justify-center">
              <svg className="h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
              </svg>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Tags row */}
          <div className="flex items-center gap-2 flex-wrap">
            <PlatformBadge platform={product.bestPricePlatform} />
            {product.brand && (
              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-primary/10 text-primary">
                {product.brand}
              </span>
            )}
            <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-500">
              {product.category}
            </span>
          </div>

          {/* Product name */}
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug">
            {product.nameEn}
          </h3>

          {/* Price */}
          <div className="space-y-0.5">
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-accent">
                ¥{product.bestPrice.toLocaleString()}
              </span>
              <span className="text-xs text-gray-400">
                ~${usdEstimate}
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-1 border-t border-gray-50">
            <span className="text-xs text-gray-400">
              Available on {product.platformCount} platform{product.platformCount !== 1 ? 's' : ''}
            </span>
            <PriceFreshnessTag updatedAt={product.updatedAt} />
          </div>
        </div>
      </Link>
    </div>
  );
}
