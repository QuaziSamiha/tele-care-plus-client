import { z } from "zod";

const existingImageSchema = z.object({
  filePath: z.string(),
  name: z.string(),
  attachId: z.number(),
});

export const comboItemSchema = z.object({
  productId: z.coerce
    .number({ message: "Pick a product" })
    .int()
    .min(1, "Pick a product"),
  variantId: z.coerce.number().int().min(1).optional(),
  quantity: z.coerce.number().int().min(1).default(1),
  unitPrice: z.coerce.number().min(0).optional(),
});

const hasUniqueItems = (items: { productId?: number; variantId?: number }[]) => {
  const seen = new Set<string>();
  for (const it of items) {
    if (!it.productId) continue;
    const key = `${it.productId}::${it.variantId ?? ""}`;
    if (seen.has(key)) return false;
    seen.add(key);
  }
  return true;
};

export const comboSchema = z
  .object({
    title: z.string().min(1, "Combo title is required").max(255),

    shortDescription: z.string().max(500).optional(),
    shortDescTh: z.string().max(500).optional(),
    description: z.string().optional(),
    descriptionTh: z.string().optional(),

    comboPrice: z.number().min(0, "Combo price must be ≥ 0"),

    startsAt: z.string().optional(),
    endsAt: z.string().optional(),

    status: z.string().optional(),
    isFeatured: z.boolean().optional(),

    items: z
      .array(comboItemSchema)
      .min(1, "Add at least one product to the combo")
      .refine(hasUniqueItems, {
        message: "Duplicate product and size combination",
      }),

    comboImages: z
      .array(z.union([z.instanceof(File), existingImageSchema]))
      .nonempty("At least one image is required"),
  })
  .refine(
    (d) => !d.startsAt || !d.endsAt || new Date(d.endsAt) >= new Date(d.startsAt),
    { message: "End date must be after start date", path: ["endsAt"] },
  );

export const updateComboSchema = z
  .object({
    title: z.string().min(1).max(255).optional(),

    shortDescription: z.string().max(500).optional(),
    shortDescTh: z.string().max(500).optional(),
    description: z.string().optional(),
    descriptionTh: z.string().optional(),

    comboPrice: z.number().min(0).optional(),

    startsAt: z.string().optional(),
    endsAt: z.string().optional(),

    status: z.string().optional(),
    isFeatured: z.boolean().optional(),

    items: z
      .array(comboItemSchema)
      .optional()
      .refine((items) => !items || hasUniqueItems(items), {
        message: "Duplicate product and size combination",
      }),

    comboImages: z
      .array(z.union([z.instanceof(File), existingImageSchema]))
      .optional(),
  })
  .refine(
    (d) => !d.startsAt || !d.endsAt || new Date(d.endsAt) >= new Date(d.startsAt),
    { message: "End date must be after start date", path: ["endsAt"] },
  );

export type ComboFormData = z.infer<typeof comboSchema>;
export type UpdateComboFormData = z.infer<typeof updateComboSchema>;
export type ComboItemFormData = z.infer<typeof comboItemSchema>;
