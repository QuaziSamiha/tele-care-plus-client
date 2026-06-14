import { v } from "./_version";

export const PRODUCT_API = {
  paths: {
    ALL: v("/product/all-product"),
    OPTIONS: v("/product/options"),
    PUBLISHED: v("/product/published-products"),
    HOME: v("/product/home"),
    BY_SLUG: (slug: string) => v(`/product/slug/${slug}`),
    CREATE: v("/product/create-product"),
    UPDATE: (id: string | number) => v(`/product/update/${id}`),
    DELETE: (id: string | number) => v(`/product/delete/${id}`),
  },
  keys: {
    ALL: ["getAllProducts"] as const,
    OPTIONS: ["getProductOptions"] as const,
    PUBLISHED: ["publishedProducts"] as const,
    HOME: ["homePage"] as const,
    BY_SLUG: (slug: string) => ["productBySlug", slug] as const,
  },
} as const;
