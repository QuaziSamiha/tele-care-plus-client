import { z } from "zod";

export const blogSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  content: z.string().min(1, "Content is required"),
  blogCategory: z.string().optional(),
  status: z.enum(["PUBLISHED", "DRAFT", "ARCHIVED"]).optional(),
  image: z.any().optional(),
});

export type BlogFormData = z.infer<typeof blogSchema>;
