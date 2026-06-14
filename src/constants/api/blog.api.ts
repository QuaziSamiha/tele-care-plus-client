import { v } from "./_version";

export const BLOG_API = {
  paths: {
    ALL: v("/blog/all-blogs"),
    PUBLISHED: v("/blog/published-blogs"),
    BY_SLUG: (slug: string) => v(`/blog/${slug}`),
    CREATE: v("/blog/create-blog"),
    UPDATE: (id: string | number) => v(`/blog/update-blog/${id}`),
  },
  keys: {
    ALL: ["getBlogMeta"] as const,
    PUBLISHED: ["publishedBlogs"] as const,
    BY_SLUG: (slug: string) => ["blogBySlug", slug] as const,
  },
} as const;
