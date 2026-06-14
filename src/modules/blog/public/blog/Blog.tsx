"use client";

import { Link } from "@/i18n/navigation";
import Image from "next/image";
import dayjs from "dayjs";
import { useGetAll } from "@/hooks/api/useGetAll";
import { IBlog } from "../../types/blog.type";
import { BLOG_API } from "@/constants/api";

const stripHtml = (html: string) =>
  html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

export default function Blog() {
  const { data, isLoading } = useGetAll<{ data: IBlog[] }>(
    BLOG_API.paths.PUBLISHED,
    BLOG_API.keys.PUBLISHED,
  );

  const blogs = data?.data ?? [];

  return (
    <section className="container mx-auto px-4 lg:px-0 py-8 mt-32 mb-20">
      {/* Header Section */}
      <div className="w-full flex flex-col gap-4 justify-center items-center mb-16">
        <p className="text-xs text-slate-500 font-semibold tracking-widest uppercase">
          INSIGHTS FOR BETTER HEALTH
        </p>
        <h2 className="text-center text-slate-800 font-bold text-3xl md:text-4xl lg:text-5xl max-w-2xl leading-tight">
          We deliver trusted medical solutions daily
        </h2>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="flex flex-col gap-4 p-3 animate-pulse">
              <div className="aspect-16/11 bg-neutral-200 rounded-sm" />
              <div className="h-3 w-24 bg-neutral-200 rounded" />
              <div className="h-6 w-full bg-neutral-200 rounded" />
              <div className="h-3 w-32 bg-neutral-200 rounded mt-2" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && blogs.length === 0 && (
        <div className="text-center text-slate-500 py-16">
          No blogs published yet.
        </div>
      )}

      {/* Blog Grid */}
      {!isLoading && blogs.length > 0 && (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {blogs.map((blog) => (
            <Link
              key={blog.id}
              href={`/blog-details/${blog.slug}`}
              className="group flex flex-col"
            >
              <div className="flex flex-col gap-4 flex-1 border border-transparent group-hover:border-neutral-200 rounded p-3 transition-colors duration-300">
                {/* Image */}
                <div className="relative aspect-16/11 overflow-hidden rounded-sm bg-neutral-100">
                  {blog.imageUrl ? (
                    <Image
                      src={blog.imageUrl}
                      alt={blog.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-400 text-sm">
                      No Image
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-col gap-2 flex-1">
                  {blog.blogCategory && (
                    <span className="w-fit text-xs font-semibold text-primary-600 uppercase tracking-widest">
                      {blog.blogCategory}
                    </span>
                  )}

                  <h3 className="line-clamp-2 text-slate-800 text-xl font-semibold leading-snug group-hover:text-primary-600 transition-colors duration-300">
                    {blog.title}
                  </h3>

                  {blog.content && (
                    <p className="line-clamp-2 text-slate-500 text-sm">
                      {stripHtml(blog.content)}
                    </p>
                  )}

                  <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium mt-auto pt-3">
                    <span>
                      {dayjs(blog.publishedAt ?? blog.createdAt).format(
                        "MMM DD, YYYY",
                      )}
                    </span>
                    <span aria-hidden>·</span>
                    <span>
                      {blog.totalComments > 0
                        ? `${blog.totalComments} Comments`
                        : "No Comments"}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-sm font-semibold text-primary-600 translate-x-0 group-hover:translate-x-1 transition-transform duration-300">
                    <span>Read More</span>
                    <span aria-hidden>→</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </section>
      )}
    </section>
  );
}
