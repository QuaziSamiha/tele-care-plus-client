import { z } from "zod";

const existingImageSchema = z.object({
  filePath: z.string(),
  name: z.string(),
  attachId: z.number(),
});

export const variantSchema = z.object({
  size: z.string().optional(),
  price: z.number().min(0).optional(),
  discountType: z.enum(["PERCENTAGE", "FIXED"]).optional(),
  discountValue: z.number().min(0).max(100).optional(),
  salePrice: z.number().min(0).optional(),
  costPerItem: z.number().min(0).optional(),
  quantity: z.number().int().min(0).optional(),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  weight: z.number().min(0).optional(),
  isDefault: z.boolean().optional(),
});

export const productSchema = z.object({
  name: z.string().min(1, "Product name is required").max(255),
  nameTh: z.string().optional(),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  shortDescription: z.string().max(500).optional(),
  shortDescTh: z.string().max(500).optional(),
  description: z.string().optional(),
  descriptionTh: z.string().optional(),
  type: z.string().optional(),
  status: z.string().optional(),
  isFeatured: z.boolean().optional(),
  dosage: z.string().optional(),
  dosageTh: z.string().optional(),
  ingredients: z.string().optional(),
  ingredientsTh: z.string().optional(),
  healthBenefits: z.string().optional(),
  healthBenefitsTh: z.string().optional(),
  warning: z.string().optional(),
  warningTh: z.string().optional(),
  storageInstructions: z.string().optional(),
  storageInstructionsTh: z.string().optional(),
  origin: z.string().optional(),
  genericName: z.string().optional(),
  categoryId: z.string().min(1, "Category is required"),
  variants: z.array(variantSchema),
  productImages: z
    .array(
      z.union([
        z.instanceof(File), // new uploaded image
        existingImageSchema, // your existing backend image shape
      ]),
    )
    .nonempty("At least one image is required"),
});

export const updateProductSchema = productSchema.extend({
  name: z.string().min(1).max(255).optional(),
  categoryId: z.string().optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;
export type UpdateProductFormData = z.infer<typeof updateProductSchema>;
export type VariantFormData = z.infer<typeof variantSchema>;
