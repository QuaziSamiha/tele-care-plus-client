"use client";

import Image from "next/image";
import { IModal } from "@/types/share-component.type";
import { CategoryStatus, ICategory } from "../types/category.type";

const statusStyles: Record<CategoryStatus, string> = {
  [CategoryStatus.ACTIVE]: "text-green-600 bg-green-100",
  [CategoryStatus.INACTIVE]: "text-red-600 bg-red-100",
  [CategoryStatus.DRAFT]: "text-blue-600 bg-blue-100",
  [CategoryStatus.ARCHIVED]: "text-yellow-600 bg-yellow-100",
  [CategoryStatus.HIDDEN]: "text-gray-600 bg-gray-100",
};

function Field({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{label}</p>
      <p className="text-sm text-slate-800">{value ?? <span className="text-slate-300">—</span>}</p>
    </div>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-neutral-100 pb-1 mt-2">
      {title}
    </p>
  );
}

export default function ViewCategory({ data, setOpen }: IModal) {
  const category = data as ICategory;

  const levelLabel = category.level === 0 ? "Root" : `Level ${category.level}`;

  return (
    <section className="p-6 flex flex-col gap-5 w-full">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-2xl font-semibold text-slate-800">{category.name}</p>
          {category.nameTh && (
            <p className="text-sm text-slate-400 mt-0.5">{category.nameTh}</p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-end shrink-0">
          <span
            className={`text-xs font-semibold px-3 py-1 rounded capitalize ${
              statusStyles[category.status] ?? "text-gray-600 bg-gray-100"
            }`}
          >
            {category.status.toLowerCase()}
          </span>
          <span
            className={`text-xs font-semibold px-3 py-1 rounded ${
              category.level === 0
                ? "bg-primary-100 text-mauve-800"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {levelLabel}
          </span>
          {category.isFeatured && (
            <span className="text-xs font-semibold px-3 py-1 rounded bg-amber-100 text-amber-600">
              Featured
            </span>
          )}
        </div>
      </div>

      {/* Images */}
      {(category.bannerUrl || category.thumbnailUrl || category.iconUrl) && (
        <>
          <SectionTitle title="Images" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {category.bannerUrl && (
              <div className="flex flex-col gap-1">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Banner</p>
                <div className="relative w-full aspect-video rounded overflow-hidden border border-neutral-200 bg-neutral-50">
                  <Image
                    src={category.bannerUrl}
                    alt="Banner"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}
            {category.thumbnailUrl && (
              <div className="flex flex-col gap-1">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Thumbnail</p>
                <div className="relative w-full aspect-video rounded overflow-hidden border border-neutral-200 bg-neutral-50">
                  <Image
                    src={category.thumbnailUrl}
                    alt="Thumbnail"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}
            {category.iconUrl && (
              <div className="flex flex-col gap-1">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Icon</p>
                <div className="relative w-16 h-16 rounded overflow-hidden border border-neutral-200 bg-neutral-50">
                  <Image
                    src={category.iconUrl}
                    alt="Icon"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* General Info */}
      <SectionTitle title="General" />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <Field label="Slug" value={category.slug} />
        <Field label="Parent" value={category.parent?.name} />
        <Field label="Display Order" value={category.displayOrder} />
        <Field label="Sub-categories" value={category.childrenCount ?? 0} />
        <Field label="Products" value={category.productCount} />
      </div>

      {/* Descriptions */}
      {(category.description || category.descriptionTh) && (
        <>
          <SectionTitle title="Description" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="English" value={category.description} />
            <Field label="Thai" value={category.descriptionTh} />
          </div>
        </>
      )}

      {/* SEO */}
      {(category.metaTitle || category.metaDescription || category.metaTitleTh || category.metaDescriptionTh) && (
        <>
          <SectionTitle title="SEO" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Meta Title (EN)" value={category.metaTitle} />
            <Field label="Meta Title (TH)" value={category.metaTitleTh} />
            <Field label="Meta Description (EN)" value={category.metaDescription} />
            <Field label="Meta Description (TH)" value={category.metaDescriptionTh} />
          </div>
        </>
      )}

      {/* Audit */}
      <SectionTitle title="Audit" />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <Field
          label="Created At"
          value={category.createdAt ? new Date(category.createdAt).toLocaleString() : undefined}
        />
        <Field
          label="Updated At"
          value={category.updatedAt ? new Date(category.updatedAt).toLocaleString() : undefined}
        />
        <Field label="Created By" value={category.createdByUser?.name} />
        <Field label="Updated By" value={category.updatedByUser?.name} />
      </div>

      {/* Footer */}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={() => setOpen?.(false)}
          className="border border-neutral-300 font-semibold text-base text-neutral-600 rounded cursor-pointer px-5 py-2.5"
        >
          Close
        </button>
      </div>
    </section>
  );
}
