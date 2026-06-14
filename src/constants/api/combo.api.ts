import { v } from "./_version";

export const COMBO_API = {
  paths: {
    ALL: v("/combo/all-combo"),
    PUBLISHED: v("/combo/published-combos"),
    BY_SLUG: (slug: string) => v(`/combo/slug/${slug}`),
    CREATE: v("/combo/create-combo"),
    UPDATE: (id: string | number) => v(`/combo/update/${id}`),
  },
  keys: {
    ALL: ["getAllCombos"] as const,
    PUBLISHED: ["publishedCombos"] as const,
    BY_SLUG: (slug: string) => ["comboBySlug", slug] as const,
  },
} as const;
