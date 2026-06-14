"use client";
import { IModal } from "@/types/share-component.type";
import { IBlog } from "../types/blog.type";
import Image from "next/image";
import dayjs from "dayjs";

export default function ViewBlog({
  data,
  setOpen,
}: IModal & { data?: IBlog | null }) {
  if (!data) return null;

  return (
    <section className="p-6 flex flex-col gap-6 w-full max-h-[85vh] overflow-y-auto">
      <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
        <p className="text-2xl font-semibold text-slate-800">Blog Details</p>
        <button
          onClick={() => setOpen?.(false)}
          className="text-neutral-500 hover:text-neutral-700 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex flex-col gap-8">
        {/* Header section */}
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {data.imageUrl ? (
            <div className="relative w-full md:w-1/3 aspect-video rounded-xl overflow-hidden shadow-sm shrink-0 border border-neutral-200">
              <Image src={data.imageUrl} alt={data.title} fill className="object-cover" />
            </div>
          ) : (
            <div className="w-full md:w-1/3 aspect-video rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-400 shrink-0 border border-neutral-200">
              No Image Available
            </div>
          )}

          <div className="flex flex-col gap-4 flex-1">
            <h2 className="text-2xl font-bold text-slate-900 leading-snug">{data.title}</h2>
            
            <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm pt-2">
              <div className="flex flex-col gap-1">
                <span className="text-neutral-500 font-medium">Category</span>
                <span className="text-slate-800 font-semibold">{data.blogCategory || "—"}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-neutral-500 font-medium">Status</span>
                <span className={`w-fit px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${
                  data.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' :
                  data.status === 'DRAFT' ? 'bg-blue-100 text-blue-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {data.status}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-neutral-500 font-medium">Published At</span>
                <span className="text-slate-800 font-semibold">
                  {data.publishedAt ? dayjs(data.publishedAt).format("MMMM DD, YYYY") : "Not published"}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-neutral-500 font-medium">Total Comments</span>
                <span className="text-slate-800 font-semibold">{data.totalComments}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-col gap-4 border-t border-neutral-100 pt-6">
          <h3 className="text-lg font-bold text-slate-800">Content</h3>
          {/* Using dangerouslySetInnerHTML to render the rich text editor output */}
          <div 
            className="prose prose-slate max-w-none prose-headings:font-bold prose-a:text-primary-600 hover:prose-a:text-mauve-800 prose-img:rounded-xl"
            dangerouslySetInnerHTML={{ __html: data.content }}
          />
        </div>
      </div>
    </section>
  );
}
