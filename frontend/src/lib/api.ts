import type { SearchResult, Product, Category } from "@/types/product";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

async function fetchApi<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function searchProducts(
  q: string,
  page = 1,
  category?: string,
  sort?: string,
) {
  const params = new URLSearchParams({ q, page: String(page) });
  if (category) params.set("category", category);
  if (sort) params.set("sort", sort);
  return fetchApi<SearchResult>(`/search?${params}`);
}

export async function getProduct(id: string) {
  return fetchApi<Product>(`/products/${id}`);
}

export async function compareProducts(ids: string[]) {
  return fetchApi<{ products: Product[] }>(`/compare?ids=${ids.join(",")}`);
}

export async function getCategories() {
  return fetchApi<Category[]>("/categories");
}

export async function submitFeedback(data: {
  platform_product_id?: string;
  feedback_type: string;
  details: string;
}) {
  return fetchApi<{ status: string }>("/feedback", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
