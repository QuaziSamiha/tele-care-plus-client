import { z } from "zod";

export const addStockItemSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  variantId: z.string().optional().nullable(),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  manufacturingDate: z.string().optional().nullable(),
  expiryDate: z.string().optional().nullable(),
});

export const addStockSchema = z.object({
  items: z.array(addStockItemSchema).min(1, "Add at least one item"),
});

export const removeStockSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  variantId: z.string().optional().nullable(),
  batchId: z.string().min(1, "Batch is required"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  changeType: z
    .enum(["SALE", "RETURN", "ADJUSTMENT", "DAMAGE", "EXPIRED"])
    .optional(),
  reason: z.string().max(500).optional(),
});

export type AddStockFormData = z.infer<typeof addStockSchema>;
export type AddStockItemFormData = z.infer<typeof addStockItemSchema>;
export type RemoveStockFormData = z.infer<typeof removeStockSchema>;
