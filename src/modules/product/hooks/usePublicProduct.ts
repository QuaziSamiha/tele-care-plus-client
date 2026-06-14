import { useGetAll } from "@/hooks/api/useGetAll";
import { IQueryParams } from "@/types/common.types";
import { IMeta } from "@/types/response.type";
import { IProduct } from "../types/product.type";
import { PRODUCT_API } from "@/constants/api";

export interface IProductQueryParams extends IQueryParams {
  categoryIds?: string;
  productType?: string;
  sortBy?: "createdAt" | "basePrice" | "name";
}

export function useGetPublishedProducts(params: IProductQueryParams) {
  return useGetAll<{ data: IProduct[]; meta: IMeta }>(
    PRODUCT_API.paths.PUBLISHED,
    [
      "publishedProducts",
      String(params.page),
      String(params.limit),
      params.search ?? "",
      params.sortBy ?? "",
      params.sortOrder ?? "",
      params.categoryIds ?? "",
      params.productType ?? "",
    ],
    params,
  );
}

export function useGetProductBySlug(slug: string) {
  return useGetAll<{ data: IProduct }>(
    PRODUCT_API.paths.BY_SLUG(slug),
    ["productBySlug", slug],
    undefined,
    undefined,
    Boolean(slug),
  );
}
