"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { BsFilterSquare } from "react-icons/bs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductSidebar from "./ProductSidebar";
import ProductGrid from "./ProductGrid";
import MobileFilterDrawer from "./MobileFilterDrawer";
import SortDropdown from "./SortDropdown";
import { useGetPublishedProducts } from "../../hooks/usePublicProduct";
import { useProductFilter } from "../../hooks/useProductFilter";

export default function Product() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const searchParams = useSearchParams();
  const { updateFilter } = useProductFilter();

  const page = Number(searchParams.get("page") ?? "1");
  const limit = Number(searchParams.get("limit") ?? "20");
  const search = searchParams.get("search") ?? undefined;
  const sortBy =
    (searchParams.get("sortBy") as "createdAt" | "basePrice" | "name" | null) ??
    undefined;
  const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") ?? "desc";
  const categoryIds = searchParams.get("categoryIds") ?? undefined;
  const productType = searchParams.get("productType") ?? undefined;

  const { data } = useGetPublishedProducts({
    page,
    limit,
    search,
    sortBy,
    sortOrder,
    categoryIds,
    productType,
  });

  const meta = data?.meta;
  const total = meta?.totalItems ?? 0;
  const totalPages = meta?.totalPages ?? 1;
  const count = data?.data?.length ?? 0;
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = total === 0 ? 0 : from + count - 1;

  const goToPage = (p: number) => {
    if (p < 1 || p > totalPages) return;
    updateFilter("page", p);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header Banner */}
      {/* <div className="bg-linear-to-r from-mauve-700 to-primary-500 mt-24">
        <div className="container mx-auto px-4 py-12 lg:py-16">
          <p className="text-primary-100 text-sm mb-1 uppercase tracking-widest font-medium">
            Our Collection
          </p>
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
            {search ? `Results for "${search}"` : "All Products"}
          </h1>
          <p className="text-primary-100 text-sm">
            {total > 0
              ? `${total} product${total !== 1 ? "s" : ""} available`
              : "Explore our health product range"}
          </p>
        </div>
      </div> */}

      <main className="container mx-auto px-4 py-10 mt-24">
        {/* Toolbar: mobile filter btn + sort */}
        <div className="flex items-center justify-between mb-8 gap-4">
          {/* Left: filter toggle (mobile) + count */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 text-slate-700 font-medium border border-slate-200 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <BsFilterSquare className="text-base" />
              Filters
            </button>
            <span className="text-sm text-slate-400">
              {total > 0 ? `Showing ${from}–${to} of ${total}` : ""}
            </span>
          </div>

          {/* Right: sort */}
          <SortDropdown />
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar */}
          <aside className="hidden lg:block lg:w-64 shrink-0">
            <div className="sticky top-32">
              <ProductSidebar />
            </div>
          </aside>

          {/* Product grid + pagination */}
          <section className="flex-1 min-w-0">
            <ProductGrid />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  onClick={() => goToPage(page - 1)}
                  disabled={page <= 1}
                  className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (p) =>
                      p === 1 ||
                      p === totalPages ||
                      Math.abs(p - page) <= 1,
                  )
                  .reduce<(number | "...")[]>((acc, p, idx, arr) => {
                    if (idx > 0 && p - (arr[idx - 1] as number) > 1) {
                      acc.push("...");
                    }
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((item, idx) =>
                    item === "..." ? (
                      <span key={`ellipsis-${idx}`} className="px-1 text-slate-400">
                        …
                      </span>
                    ) : (
                      <button
                        key={item}
                        onClick={() => goToPage(item as number)}
                        className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${page === item
                          ? "bg-primary-600 text-white"
                          : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                          }`}
                      >
                        {item}
                      </button>
                    ),
                  )}

                <button
                  onClick={() => goToPage(page + 1)}
                  disabled={page >= totalPages}
                  className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </section>
        </div>
      </main>

      <MobileFilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
      />
    </div>
  );
}
