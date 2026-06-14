import { useGetAll } from "@/hooks/api/useGetAll";
import { IQueryParams } from "@/types/common.types";
import { IMeta } from "@/types/response.type";
import { ICombo } from "../types/combo.type";
import { COMBO_API } from "@/constants/api";

export interface IComboQueryParams extends IQueryParams {
  sortBy?: "createdAt" | "comboPrice" | "title";
  activeOnly?: "true" | "false";
  featuredOnly?: "true" | "false";
}

export function useGetPublishedCombos(params: IComboQueryParams) {
  return useGetAll<{ data: ICombo[]; meta: IMeta }>(
    COMBO_API.paths.PUBLISHED,
    [
      "publishedCombos",
      String(params.page),
      String(params.limit),
      params.search ?? "",
      params.sortBy ?? "",
      params.sortOrder ?? "",
      params.activeOnly ?? "",
      params.featuredOnly ?? "",
    ],
    params,
  );
}

export function useGetComboBySlug(slug: string) {
  return useGetAll<{ data: ICombo }>(
    COMBO_API.paths.BY_SLUG(slug),
    ["comboBySlug", slug],
    undefined,
    undefined,
    Boolean(slug),
  );
}
