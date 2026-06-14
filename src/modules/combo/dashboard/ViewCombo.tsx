"use client";

import Image from "next/image";
import { IModal } from "@/types/share-component.type";
import { ICombo, ComboStatus } from "../types/combo.type";

const statusStyles: Record<string, string> = {
  [ComboStatus.ACTIVE]: "text-green-600 bg-green-100",
  [ComboStatus.INACTIVE]: "text-red-600 bg-red-100",
  [ComboStatus.DRAFT]: "text-blue-600 bg-blue-100",
  [ComboStatus.ARCHIVED]: "text-yellow-600 bg-yellow-100",
  [ComboStatus.HIDDEN]: "text-gray-600 bg-gray-100",
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

function HtmlField({ label, html }: { label: string; html?: string | null }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
        {label}
      </p>
      <div
        className="rich-text-container text-sm text-slate-600 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: html ?? "" }}
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

function fmtDate(d?: string | Date) {
  if (!d) return undefined;
  const date = typeof d === "string" ? new Date(d) : d;
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toLocaleDateString();
}

export default function ViewCombo({ data, setOpen }: IModal) {
  const combo = data as ICombo;

  const savings =
    combo.totalPrice > combo.comboPrice
      ? combo.totalPrice - combo.comboPrice
      : 0;

  return (
    <section className="p-6 flex flex-col gap-5 w-full">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-2xl font-semibold text-slate-800">{combo.title}</p>
          {combo.titleTh && (
            <p className="text-sm text-slate-400 mt-0.5">{combo.titleTh}</p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-end shrink-0">
          <span
            className={`text-xs font-semibold px-3 py-1 rounded capitalize ${
              statusStyles[combo.status] ?? "text-gray-600 bg-gray-100"
            }`}
          >
            {combo.status.toLowerCase()}
          </span>
          {combo.isFeatured && (
            <span className="text-xs font-semibold px-3 py-1 rounded bg-amber-100 text-amber-600">
              Featured
            </span>
          )}
        </div>
      </div>

      {/* Images */}
      {combo.images?.length > 0 && (
        <>
          <SectionTitle title="Images" />
          <div className="grid grid-cols-4 gap-3">
            {combo.images.map((img) => (
              <div
                key={img.id}
                className="relative aspect-square rounded overflow-hidden border border-neutral-200 bg-neutral-50"
              >
                <Image
                  src={img.url}
                  alt={img.altText ?? combo.title}
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
      <SectionTitle title="Pricing & Window" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Field label="Total Price" value={`฿${combo.totalPrice.toFixed(2)}`} />
        <Field label="Combo Price" value={`฿${combo.comboPrice.toFixed(2)}`} />
        <Field
          label="Customer Saves"
          value={savings ? `฿${savings.toFixed(2)}` : "—"}
        />
        <Field
          label="Window"
          value={
            combo.startsAt || combo.endsAt
              ? `${fmtDate(combo.startsAt) ?? "—"} → ${fmtDate(combo.endsAt) ?? "—"}`
              : undefined
          }
        />
      </div>

      {/* Items */}
      {combo.items?.length > 0 && (
        <>
          <SectionTitle title="Products in this Combo" />
          <div className="overflow-x-auto rounded border border-neutral-200">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50">
                <tr className="border-b border-neutral-200">
                  <th className="text-left py-2 px-3 font-semibold text-slate-500 text-xs">
                    Product
                  </th>
                  <th className="text-left py-2 px-3 font-semibold text-slate-500 text-xs">
                    Category
                  </th>
                  <th className="text-left py-2 px-3 font-semibold text-slate-500 text-xs">
                    Size
                  </th>
                  <th className="text-left py-2 px-3 font-semibold text-slate-500 text-xs">
                    Qty
                  </th>
                  <th className="text-left py-2 px-3 font-semibold text-slate-500 text-xs">
                    Unit Price
                  </th>
                </tr>
              </thead>
              <tbody>
                {combo.items.map((it) => (
                  <tr
                    key={it.id}
                    className="border-b border-neutral-100 last:border-0"
                  >
                    <td className="py-2 px-3 text-slate-700">
                      {it.product?.name ?? `Product #${it.productId}`}
                    </td>
                    <td className="py-2 px-3 text-slate-600">
                      {it.product?.categoryName ?? "—"}
                    </td>
                    <td className="py-2 px-3 text-slate-600">
                      {it.variant?.size ?? it.variant?.name ?? "—"}
                    </td>
                    <td className="py-2 px-3 text-slate-700">{it.quantity}</td>
                    <td className="py-2 px-3 text-slate-700">
                      {it.unitPrice != null
                        ? `฿${it.unitPrice.toFixed(2)}`
                        : it.variant
                          ? `฿${it.variant.price.toFixed(2)}`
                          : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Descriptions */}
      {(combo.shortDescription || combo.description) && (
        <>
          <SectionTitle title="Description" />
          <div className="flex flex-col gap-3">
            {combo.shortDescription && (
              <HtmlField label="Short Description" html={combo.shortDescription} />
            )}
            {combo.description && (
              <HtmlField label="Description" html={combo.description} />
            )}
          </div>
        </>
      )}

      {/* Audit */}
      <SectionTitle title="Audit" />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <Field label="Slug" value={combo.slug} />
        <Field label="Created At" value={fmtDate(combo.createdAt)} />
        <Field label="Updated At" value={fmtDate(combo.updatedAt)} />
        <Field label="Created By" value={combo.createdByUser?.name} />
        <Field label="Updated By" value={combo.updatedByUser?.name} />
      </div>

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
