import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";

export const useProductFilter = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateUrl = useCallback(
    (params: URLSearchParams) => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router],
  );

  const updateFilter = (key: string, value: unknown) => {
    const params = new URLSearchParams(searchParams.toString());

    if (!value || (Array.isArray(value) && value.length === 0)) {
      params.delete(key);
    } else {
      params.set(
        key,
        Array.isArray(value) ? value.join(",") : value.toString(),
      );
    }

    params.set("page", "1");
    updateUrl(params);
  };

  const clearFilters = () => {
    router.push(pathname, { scroll: false });
  };

  const selectedCategories =
    searchParams.get("parentCategoryIds")?.split(",").map(Number) || [];
  const selectedCategoryIds =
    searchParams.get("categoryIds")?.split(",").map(Number) || [];
  const selectedProductType = searchParams.get("productType") || "";
  const selectedProductTypes = selectedProductType
    ? selectedProductType.split(",")
    : [];
  const selectedPriceRange = searchParams.get("priceRange") || "";
  const isAnyFilterActive =
    selectedCategoryIds.length > 0 ||
    !!selectedProductType ||
    !!selectedPriceRange;

  return {
    updateFilter,
    clearFilters,
    selectedCategories,
    selectedCategoryIds,
    selectedProductTypes,
    selectedProductType,
    selectedPriceRange,
    isAnyFilterActive,
  };
};
