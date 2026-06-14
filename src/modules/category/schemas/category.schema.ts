import { z } from "zod";

export const CategoryStatusEnum = z.enum([
  "ACTIVE",
  "INACTIVE",
  "DRAFT",
  "ARCHIVED",
  "HIDDEN",
]);

export const categorySchema = z.object({
  categoryName: z
    .string("Category name is required") // Custom msg
    .min(2, "Category name is too short")
    .max(100, "Category name is too long"),

  parentId: z.string().optional().nullable(),

  status: CategoryStatusEnum.default("ACTIVE").optional(),

  image: z
    .union([z.string(), z.instanceof(File)])
    .optional()
    .nullable(),
});

export const updateCategorySchema = categorySchema.partial();

export type CategoryFormData = z.infer<typeof categorySchema>;
export type UpdateCategoryFormData = z.infer<typeof updateCategorySchema>;
