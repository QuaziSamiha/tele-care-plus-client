import { v } from "./_version";

export const INVENTORY_API = {
  paths: {
    ALL: v("/inventory/all-inventory"),
    BY_ID: (id: string | number) => v(`/inventory/${id}`),
    BATCHES_FOR_PRODUCT: (productId: string | number) =>
      v(`/inventory/product/${productId}/batches`),
    ADD_STOCK: v("/inventory/add-stock"),
    REMOVE_STOCK: v("/inventory/remove-stock"),
  },
  keys: {
    ALL: ["getAllInventory"] as const,
    BY_ID: (id: string | number) => ["getInventoryDetail", String(id)] as const,
    BATCHES_FOR_PRODUCT: (productId: string | number) =>
      ["getBatchesForProduct", String(productId)] as const,
  },
} as const;
