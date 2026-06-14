"use client";

import { useSearchParams } from "next/navigation";
import ProductCard from "./ProductCard";
import { useGetPublishedProducts } from "../../hooks/usePublicProduct";

export default function ProductGrid() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") ?? "1");
  const limit = Number(searchParams.get("limit") ?? "20");
  const search = searchParams.get("search") ?? undefined;
  const sortBy =
    (searchParams.get("sortBy") as "createdAt" | "basePrice" | "name" | null) ??
    undefined;
  const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") ?? "desc";
  const categoryIds = searchParams.get("categoryIds") ?? undefined;
  const productType = searchParams.get("productType") ?? undefined;

  const { data, isLoading } = useGetPublishedProducts({
    page,
    limit,
    search,
    sortBy,
    sortOrder,
    categoryIds,
    productType,
  });

  const products = data?.data ?? [];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-3 animate-pulse">
            <div className="bg-neutral-200 aspect-square rounded" />
            <div className="h-4 w-3/4 bg-neutral-200 rounded" />
            <div className="h-4 w-1/3 bg-neutral-200 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
        <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center">
          <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0H4" />
          </svg>
        </div>
        <p className="text-slate-500 font-medium">No products found</p>
        <p className="text-slate-400 text-sm">Try adjusting your filters or search term</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-8">
      {products.map((product) => (
        <ProductCard
          key={`${product.type}-${product.id}`}
          product={product}
        />
      ))}
    </div>
  );
}
