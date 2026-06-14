"use client";

import Image from "next/image";
import dayjs from "dayjs";
import { Link } from "@/i18n/navigation";
import { useGetAll } from "@/hooks/api/useGetAll";
import { IBlog } from "../../types/blog.type";
import { BLOG_API } from "@/constants/api";

interface RelatedBlogsProps {
  currentSlug?: string;
}

export default function RelatedBlogs({ currentSlug }: RelatedBlogsProps) {
  const { data, isLoading } = useGetAll<{ data: IBlog[] }>(
    BLOG_API.paths.PUBLISHED,
    BLOG_API.keys.PUBLISHED,
  );

  const related = (data?.data ?? [])
    .filter((b) => b.slug !== currentSlug)
    .slice(0, 2);

  if (!isLoading && related.length === 0) return null;

  return (
    <section className="py-16 border-t border-slate-100">
      <div className="container mx-auto px-4 lg:px-0">
        <h2 className="text-slate-800 text-3xl font-bold mb-10">
          You May Also Like
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {isLoading
            ? Array.from({ length: 2 }).map((_, idx) => (
                <div key={idx} className="flex flex-col gap-5 animate-pulse">
                  <div className="aspect-16/10 bg-neutral-200 rounded-sm" />
                  <div className="h-3 w-24 bg-neutral-200 rounded" />
                  <div className="h-8 w-full bg-neutral-200 rounded" />
                  <div className="h-3 w-32 bg-neutral-200 rounded" />
                </div>
              ))
            : related.map((blog) => (
                <Link
                  key={blog.id}
                  href={`/blog-details/${blog.slug}`}
                  className="group"
                >
                  <div className="flex flex-col gap-5">
                    <div className="relative aspect-16/10 overflow-hidden rounded-sm bg-neutral-100">
                      {blog.imageUrl ? (
                        <Image
                          src={blog.imageUrl}
                          alt={blog.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-400 text-sm">
                          No Image
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      {blog.blogCategory && (
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                          {blog.blogCategory}
                        </p>
                      )}

                      <h3 className="text-slate-800 text-2xl lg:text-3xl font-bold leading-tight group-hover:text-primary-600 transition-colors line-clamp-2">
                        {blog.title}
                      </h3>

                      <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                        <span>
                          {dayjs(blog.publishedAt ?? blog.createdAt).format(
                            "MMM DD, YYYY",
                          )}
                        </span>
                        <span className="text-[8px]">●</span>
                        <span>
                          {blog.totalComments > 0
                            ? `${blog.totalComments} Comments`
                            : "No Comments"}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
        </div>
      </div>
    </section>
  );
}
