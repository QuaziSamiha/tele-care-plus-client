"use client";

import Image from "next/image";
import { IModal } from "@/types/share-component.type";
import { IProduct, ProductStatus } from "../types/product.type";

const statusStyles: Record<string, string> = {
  [ProductStatus.ACTIVE]: "text-green-600 bg-green-100",
  [ProductStatus.INACTIVE]: "text-red-600 bg-red-100",
  [ProductStatus.DRAFT]: "text-blue-600 bg-blue-100",
  [ProductStatus.ARCHIVED]: "text-yellow-600 bg-yellow-100",
  [ProductStatus.HIDDEN]: "text-gray-600 bg-gray-100",
};

const stockStyles: Record<string, string> = {
  IN_STOCK: "text-green-600 bg-green-100",
  LOW_STOCK: "text-amber-600 bg-amber-100",
  OUT_OF_STOCK: "text-red-600 bg-red-100",
};

function Field({
  label,
  value,
}: {
  label: string;
  value?: string | number | boolean | null;
}) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
        {label}
      </p>
      <p className="text-sm text-slate-800">
        {value == null || value === "" ? (
          <span className="text-slate-300">—</span>
        ) : typeof value === "boolean" ? (
          value ? "Yes" : "No"
        ) : (
          value
        )}
      </p>
    </div>
  );
}

function HtmlField({
  label,
  html,
}: {
  label: string;
  html?: string | null;
}) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
        {label}
      </p>
      <div
        className="text-justify text-sm md:text-base lg:text-lg text-neutral-600 leading-relaxed"
        dangerouslySetInnerHTML={{
          __html: html ?? "",
        }}
      />
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

export default function ViewProduct({ data, setOpen }: IModal) {
  const product = data as IProduct;

  return (
    <section className="p-6 flex flex-col gap-5 w-full">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-2xl font-semibold text-slate-800">
            {product.name}
          </p>
          {product.nameTh && (
            <p className="text-sm text-slate-400 mt-0.5">{product.nameTh}</p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-end shrink-0">
          <span
            className={`text-xs font-semibold px-3 py-1 rounded capitalize ${
              statusStyles[product.status] ?? "text-gray-600 bg-gray-100"
            }`}
          >
            {product.status.toLowerCase()}
          </span>
          <span
            className={`text-xs font-semibold px-3 py-1 rounded ${
              stockStyles[product.stockStatus] ?? "text-gray-600 bg-gray-100"
            }`}
          >
            {product.stockStatus.replace("_", " ")}
          </span>
          {product.isFeatured && (
            <span className="text-xs font-semibold px-3 py-1 rounded bg-amber-100 text-amber-600">
              Featured
            </span>
          )}
        </div>
      </div>

      {/* Images */}
      {product.images?.length > 0 && (
        <>
          <SectionTitle title="Images" />
          <div className="grid grid-cols-4 gap-3">
            {product.images.map((img) => (
              <div
                key={img.id}
                className="relative aspect-square rounded overflow-hidden border border-neutral-200 bg-neutral-50"
              >
                <Image
                  src={img.url}
                  alt={img.altText ?? product.name}
                  fill
                  className="object-cover"
                />
                {img.isPrimary && (
                  <span className="absolute bottom-0 left-0 right-0 text-center text-[10px] bg-primary-600/80 text-white py-0.5">
                    Primary
                  </span>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Pricing */}
      <SectionTitle title="Pricing" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Field label="Base Price" value={product.basePrice} />
        <Field label="Sale Price" value={product.salePrice} />
        <Field label="Discount Type" value={product.discountType} />
        <Field label="Discount Value" value={product.discountValue} />
      </div>

      {/* Variants */}
      {product.variants?.length > 0 && (
        <>
          <SectionTitle title="Variants" />
          <div className="overflow-x-auto rounded border border-neutral-200">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50">
                <tr className="border-b border-neutral-200">
                  <th className="text-left py-2 px-3 font-semibold text-slate-500 text-xs">
                    Name
                  </th>
                  <th className="text-left py-2 px-3 font-semibold text-slate-500 text-xs">
                    Size
                  </th>
                  <th className="text-left py-2 px-3 font-semibold text-slate-500 text-xs">
                    Price
                  </th>
                  <th className="text-left py-2 px-3 font-semibold text-slate-500 text-xs">
                    Sale Price
                  </th>
                  <th className="text-left py-2 px-3 font-semibold text-slate-500 text-xs">
                    Qty
                  </th>
                  <th className="text-left py-2 px-3 font-semibold text-slate-500 text-xs">
                    Stock
                  </th>
                </tr>
              </thead>
              <tbody>
                {product.variants.map((v) => (
                  <tr
                    key={v.id}
                    className="border-b border-neutral-100 last:border-0"
                  >
                    <td className="py-2 px-3 text-slate-700">{v.name}</td>
                    <td className="py-2 px-3 text-slate-600">
                      {v.size ?? "—"}
                    </td>
                    <td className="py-2 px-3 text-slate-700">{v.price}</td>
                    <td className="py-2 px-3 text-slate-700">
                      {v.salePrice ?? "—"}
                    </td>
                    <td className="py-2 px-3 text-slate-600">
                      {v.quantity ?? 0}
                    </td>
                    <td className="py-2 px-3">
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded ${
                          stockStyles[v.stockStatus] ??
                          "text-gray-600 bg-gray-100"
                        }`}
                      >
                        {v.stockStatus.replace("_", " ")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* General Info */}
      <SectionTitle title="General" />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <Field label="Slug" value={product.slug} />
        <Field label="Category" value={product.category?.name} />
        <Field label="Type" value={product.type} />
        <Field label="SKU" value={product.sku} />
        <Field label="Barcode" value={product.barcode} />
        <Field label="Origin" value={product.origin} />
        <Field label="Generic Name" value={product.genericName} />
        <Field label="Total Stock" value={product.totalStock} />
        <Field label="Has Variants" value={product.hasVariants} />
      </div>

      {/* Descriptions */}
      {(product.shortDescription || product.description) && (
        <>
          <SectionTitle title="Description" />
          <div className="flex flex-col gap-3">
            {product.shortDescription && (
              <HtmlField
                label="Short Description"
                html={product.shortDescription}
              />
            )}
            {product.description && (
              <HtmlField label="Description" html={product.description} />
            )}
          </div>
        </>
      )}

      {/* Additional Info */}
      {(product.dosage ||
        product.ingredients ||
        product.healthBenefits ||
        product.warning ||
        product.storageInstructions) && (
        <>
          <SectionTitle title="Additional Information" />
          <div className="grid grid-cols-2 gap-4">
            {product.dosage && (
              <HtmlField label="Dosage" html={product.dosage} />
            )}
            {product.ingredients && (
              <HtmlField label="Ingredients" html={product.ingredients} />
            )}
            {product.healthBenefits && (
              <HtmlField label="Health Benefits" html={product.healthBenefits} />
            )}
            {product.warning && (
              <HtmlField label="Warning" html={product.warning} />
            )}
            {product.storageInstructions && (
              <HtmlField
                label="Storage Instructions"
                html={product.storageInstructions}
              />
            )}
          </div>
        </>
      )}

      {/* Audit */}
      <SectionTitle title="Audit" />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <Field
          label="Created At"
          value={
            product.createdAt
              ? new Date(product.createdAt).toLocaleString()
              : undefined
          }
        />
        <Field
          label="Updated At"
          value={
            product.updatedAt
              ? new Date(product.updatedAt).toLocaleString()
              : undefined
          }
        />
        <Field label="Created By" value={product.createdByUser?.name} />
        <Field label="Updated By" value={product.updatedByUser?.name} />
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
