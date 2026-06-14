"use client";

import Image from "next/image";
import dayjs from "dayjs";
import { useParams } from "next/navigation";
import { useGetAll } from "@/hooks/api/useGetAll";
import { IBlog } from "../../types/blog.type";
import RelatedBlogs from "./RelatedBlog";
import { BLOG_API } from "@/constants/api";

export default function BlogDetails() {
  const { slug } = useParams<{ slug: string }>();

  const { data, isLoading } = useGetAll<{ data: IBlog }>(
    BLOG_API.paths.BY_SLUG(slug),
    BLOG_API.keys.BY_SLUG(slug),
    undefined,
    undefined,
    Boolean(slug),
  );

  const blog = data?.data;

  if (isLoading) {
    return (
      <section className="container mx-auto px-4 xl:px-0 py-8 mt-32 mb-20">
        <div className="max-w-5xl mx-auto animate-pulse flex flex-col gap-6">
          <div className="h-12 w-3/4 bg-neutral-200 rounded" />
          <div className="h-4 w-48 bg-neutral-200 rounded" />
          <div className="aspect-21/10 w-full bg-neutral-200 rounded-sm" />
          <div className="h-4 w-full bg-neutral-200 rounded" />
          <div className="h-4 w-full bg-neutral-200 rounded" />
          <div className="h-4 w-5/6 bg-neutral-200 rounded" />
        </div>
      </section>
    );
  }

  if (!blog) {
    return (
      <section className="container mx-auto px-4 xl:px-0 py-8 mt-32 mb-20">
        <div className="max-w-5xl mx-auto text-center text-slate-500 py-16">
          Blog not found.
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 xl:px-0 py-8 mt-32 mb-20">
      <article className="max-w-5xl mx-auto">
        {/* Header Section */}
        <header className="mb-10 max-w-4xl">
          {blog.blogCategory && (
            <p className="text-xs font-bold text-primary-600 uppercase tracking-widest mb-3">
              {blog.blogCategory}
            </p>
          )}
          <h1 className="text-slate-900 font-bold text-3xl md:text-5xl leading-tight mb-6">
            {blog.title}
          </h1>
          <div className="flex items-center gap-2 text-slate-400 text-sm font-medium uppercase tracking-wide">
            <span>
              {dayjs(blog.publishedAt ?? blog.createdAt).format(
                "MMM DD, YYYY",
              )}
            </span>
            <span>•</span>
            <span>
              {blog.totalComments > 0
                ? `${blog.totalComments} Comments`
                : "No Comments"}
            </span>
          </div>
        </header>

        {/* Hero Image */}
        {blog.imageUrl && (
          <div className="relative w-full aspect-16/10 md:aspect-21/10 mb-12 overflow-hidden rounded-sm bg-neutral-100">
            <Image
              src={blog.imageUrl}
              alt={blog.title}
              fill
              priority
              className="object-cover"
            />
          </div>
        )}

        {/* Content Body */}
        <div
          className="prose prose-slate prose-lg w-full max-w-4xl wrap-break-word whitespace-normal prose-p:whitespace-normal prose-p:wrap-break-word prose-headings:font-bold prose-a:text-primary-600 hover:prose-a:text-mauve-800 prose-img:rounded-xl text-slate-500 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* Related */}
        <div className="mt-20">
          <RelatedBlogs currentSlug={blog.slug} />
        </div>
      </article>
    </section>
  );
}
