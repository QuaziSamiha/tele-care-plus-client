"use client";

import { useGet } from "@/hooks/api/useGet";
import { IGenericResponse } from "@/types/response.type";
import { ICategory } from "../types/category.type";
import { CATEGORY_API } from "@/constants/api";

export function usePublicCategories() {
  const { data, isLoading } = useGet<IGenericResponse<ICategory[]>>(
    CATEGORY_API.paths.ALL_ACTIVE,
    ["allActiveCategories"],
  );

  const allCategories = data?.data ?? [];
  const rootCategories = allCategories.filter((c) => c.parentId === null);
  const getChildren = (parentId: number) =>
    allCategories.filter((c) => c.parentId === parentId);

  return { rootCategories, getChildren, isLoading };
}
