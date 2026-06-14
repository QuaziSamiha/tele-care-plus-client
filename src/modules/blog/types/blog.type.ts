export interface IBlog {
  id: number;
  sid: string;
  title: string;
  slug: string;
  content: string;
  blogCategory: string | null;
  imageUrl: string | null;
  status: "PUBLISHED" | "DRAFT" | "ARCHIVED";
  totalComments: number;
  metaTitle: string | null;
  metaDescription: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  authorId: number | null;
}
