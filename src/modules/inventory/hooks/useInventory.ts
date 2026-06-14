import { useGet } from "@/hooks/api/useGet";
import { useGetAll } from "@/hooks/api/useGetAll";
import { IGenericResponse, IMeta } from "@/types/response.type";
import { IQueryParams } from "@/types/common.types";
import { IBatch, IInventory } from "../types/inventory.type";
import { INVENTORY_API } from "@/constants/api";

export function useGetAllInventory(params: IQueryParams) {
  return useGetAll<{ data: IInventory[]; meta: IMeta }>(
    INVENTORY_API.paths.ALL,
    [
      "getAllInventory",
      String(params.page),
      String(params.limit),
      params.search ?? "",
      params.sortOrder ?? "",
    ],
    params,
  );
}

export function useGetInventoryDetail(id?: number) {
  return useGet<IGenericResponse<IInventory>>(
    INVENTORY_API.paths.BY_ID(id ?? 0),
    ["getInventoryDetail", String(id ?? "")],
    undefined,
    Boolean(id),
  );
}

export function useGetBatchesForProduct(
  productId?: number,
  variantId?: number | null,
) {
  return useGet<IGenericResponse<IBatch[]>>(
    INVENTORY_API.paths.BATCHES_FOR_PRODUCT(productId ?? 0),
    [
      "getBatchesForProduct",
      String(productId ?? ""),
      String(variantId ?? ""),
    ],
    variantId !== undefined && variantId !== null
      ? { variantId }
      : undefined,
    Boolean(productId),
  );
}
