import { useGet } from "@/hooks/api/useGet";
import { useGetAll } from "@/hooks/api/useGetAll";
import { IQueryParams } from "@/types/common.types";
import { IGenericResponse, IMeta } from "@/types/response.type";
import { ICombo } from "../types/combo.type";
import { IProductOption } from "@/modules/product/hooks/useAdminProduct";
import { IOptionCategory } from "@/modules/category/types/category.type";
import { COMBO_API, PRODUCT_API, CATEGORY_API } from "@/constants/api";

export default function useAdminCombo(params?: IQueryParams) {
  // Categories (for product picker)
  const { data: productCategoryData, isLoading: productCategoryLoading } =
    useGet<IGenericResponse<IOptionCategory[]>>(CATEGORY_API.paths.PRODUCT_CATEGORIES, [
      "getAllActiveProductCategory",
    ]);
  const productCategories = productCategoryData?.data ?? [];

  // Product options (for product + variant pickers)
  const { data: productOptionsData, isLoading: productOptionsLoading } = useGet<
    IGenericResponse<IProductOption[]>
  >(PRODUCT_API.paths.OPTIONS, ["getProductOptions"]);
  const productOptions = productOptionsData?.data ?? [];

  // Combo list
  const {
    data: comboData,
    isLoading: isAllComboLoading,
    refetch: refetchAllCombo,
  } = useGetAll<{ data: ICombo[]; meta: IMeta }>(
    COMBO_API.paths.ALL,
    [
      "getAllCombos",
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
    productOptions,
    productOptionsLoading,
    comboData,
    isAllComboLoading,
    refetchAllCombo,
  };
}
