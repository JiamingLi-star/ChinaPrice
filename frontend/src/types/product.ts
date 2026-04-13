export interface PlatformOffer {
  id: string;
  platform: string;
  platformProductId: string;
  titleEn: string;
  url: string;
  price: number;
  priceType: string;
  originalPrice: number | null;
  shippingFee: number | null;
  rating: number | null;
  reviewCount: number | null;
  salesCount: number | null;
  sellerName: string | null;
  sellerAgeDays: number | null;
  specsEn: Record<string, string>;
  imageUrl: string | null;
  status: string;
  priceUpdatedAt: string;
}

export interface Product {
  id: string;
  nameEn: string;
  nameZh: string | null;
  category: string;
  brand: string | null;
  bestPrice: number;
  bestPricePlatform: string;
  attributesEn: Record<string, string>;
  platformOffers: PlatformOffer[];
  updatedAt: string;
}

export interface ProductListItem {
  id: string;
  nameEn: string;
  category: string;
  brand: string | null;
  bestPrice: number;
  bestPricePlatform: string;
  imageUrl: string | null;
  platformCount: number;
  updatedAt: string;
}

export interface SearchResult {
  products: ProductListItem[];
  total: number;
  page: number;
  pageSize: number;
  query: string;
}

export interface Category {
  slug: string;
  name: string;
  productCount: number;
}
