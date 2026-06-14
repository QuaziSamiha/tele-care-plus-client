import { useGet } from "@/hooks/api/useGet";
import { IGenericResponse } from "@/types/response.type";
import { IOptionCategory } from "../types/category.type";
import { CATEGORY_API } from "@/constants/api";

export default function useCategory() {
  const { data: rootCategoryData, isLoading: rootCategoryLoading } =
    useGet<IGenericResponse<IOptionCategory[]>>(
      CATEGORY_API.paths.ACTIVE_ROOT,
      ["getAllActiveRootCategory"],
    );
  const rootCategories = rootCategoryData?.data ?? [];

  return {
    rootCategories,
    rootCategoryLoading,
  };
}
