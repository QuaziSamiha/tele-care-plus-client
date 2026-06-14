import { useGet } from "@/hooks/api/useGet";
import { useGetAll } from "@/hooks/api/useGetAll";
import { IOptionCategory } from "@/modules/category/types/category.type";
import { IQueryParams } from "@/types/common.types";
import { IGenericResponse, IMeta } from "@/types/response.type";
import { IProduct } from "../types/product.type";
import { PRODUCT_API, CATEGORY_API } from "@/constants/api";

export interface IProductOption {
  id: number;
  name: string;
  variants: { id: number; name: string; size: string | null }[];
}

export function useGetProductOptions() {
  return useGet<IGenericResponse<IProductOption[]>>(
    PRODUCT_API.paths.OPTIONS,
    ["getProductOptions"],
  );
}

export default function useAdminProduct(params?: IQueryParams) {
  const { data: productCategoryData, isLoading: productCategoryLoading } =
    useGet<IGenericResponse<IOptionCategory[]>>(CATEGORY_API.paths.PRODUCT_CATEGORIES, [
      "getAllActiveProductCategory",
    ]);
  const productCategories = productCategoryData?.data ?? [];

  const {
    data: productData,
    isLoading: isAllProductLoading,
    refetch: refetchAllProduct,
  } = useGetAll<{ data: IProduct[]; meta: IMeta }>(
    PRODUCT_API.paths.ALL,
    [
      "getAllProducts",
      String(params?.page),
      String(params?.limit),
      params?.search ?? "",
      params?.sortOrder ?? "",
    ],
    params,
  );

  return {
    productCategories,
    productCategoryLoading,
    productData,
    isAllProductLoading,
    refetchAllProduct,
  };
}
