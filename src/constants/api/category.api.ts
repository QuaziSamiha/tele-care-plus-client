import { v } from "./_version";

export const CATEGORY_API = {
  paths: {
    CREATE: v("/category/create-category"),
    ALL: v("/category/all-categories"),
    ALL_ACTIVE: v("/category/all-active-categories"),
    ACTIVE_ROOT: v("/category/active-root-categories"),
    BY_SLUG: (slug: string) => v(`/category/category-by-slug/${slug}`),
    PRODUCT_CATEGORIES: v("/category/product-categories"),
    UPDATE: (id: string | number) => v(`/category/update-category/${id}`),
    DELETE: (id: string | number) => v(`/category/delete-category/${id}`),
  },
  keys: {
    ALL: ["categories"] as const,
    ALL_ACTIVE: ["categories", "active"] as const,
    ACTIVE_ROOT: ["categories", "active-root"] as const,
    PRODUCT_CATEGORIES: ["getAllActiveProductCategory"] as const,
    BY_SLUG: (slug: string) => ["categories", "detail", slug] as const,
  },
} as const;
