"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useState } from "react";
import { CgShoppingCart } from "react-icons/cg";
import { GoStarFill } from "react-icons/go";
import { Link } from "@/i18n/navigation";
import { useGetComboBySlug } from "../../hooks/usePublicCombo";

export default function ComboDetails() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug ?? "";
  const { data, isLoading } = useGetComboBySlug(slug);
  const combo = data?.data;
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-10 mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-pulse">
          <div className="aspect-square bg-neutral-200 rounded-lg" />
          <div className="flex flex-col gap-4">
            <div className="h-6 w-1/3 bg-neutral-200 rounded" />
            <div className="h-8 w-3/4 bg-neutral-200 rounded" />
            <div className="h-5 w-1/2 bg-neutral-200 rounded" />
            <div className="h-24 w-full bg-neutral-200 rounded" />
          </div>
        </div>
      </main>
    );
  }

  if (!combo) {
    return (
      <main className="container mx-auto px-4 py-24 mt-24 text-center">
        <p className="text-slate-500 font-medium">Combo not found</p>
        <Link
          href="/product"
          className="inline-block mt-4 text-primary-600 hover:underline"
        >
          Back to products
        </Link>
      </main>
    );
  }

  const images = combo.images ?? [];
  const activeImage = images[activeImageIdx] ?? images[0];
  const imageUrl =
    activeImage?.url ?? "/images/home/product-placeholder.png";

  const hasMeaningfulHtml = (html?: string) =>
    !!html && html.replace(/<[^>]+>/g, "").trim().length > 0;
  const showShortDescription = hasMeaningfulHtml(combo.shortDescription);
  const showDescription = hasMeaningfulHtml(combo.description);

  const totalPrice = Number(combo.totalPrice) || 0;
  const comboPrice = Number(combo.comboPrice) || 0;
  const hasDiscount =
    comboPrice > 0 && totalPrice > 0 && comboPrice < totalPrice;
  const discountPercent = hasDiscount
    ? Math.round(((totalPrice - comboPrice) / totalPrice) * 100)
    : 0;
  const savings = hasDiscount ? totalPrice - comboPrice : 0;

  return (
    <main className="container mx-auto px-4 py-10 mt-24">
      <nav className="text-sm text-slate-500 mb-6 flex items-center gap-2">
        <Link href="/product" className="hover:text-slate-800">
          Products
        </Link>
        <span>/</span>
        <span className="text-slate-800 font-medium line-clamp-1">
          {combo.title}
        </span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,420px)_1fr] gap-10">
        {/* Gallery */}
        <div className="flex flex-col gap-4 w-full max-w-md">
          <div className="relative bg-neutral-100 rounded-lg overflow-hidden aspect-square">
            <span className="absolute top-3 left-3 z-10 bg-amber-500 text-white px-2.5 py-1 text-xs font-bold tracking-wide rounded">
              COMBO
            </span>
            {hasDiscount && (
              <span className="absolute top-3 right-3 z-10 bg-mauve-700 text-white px-2.5 py-1 text-xs font-bold rounded">
                -{discountPercent}%
              </span>
            )}
            <Image
              src={imageUrl}
              fill
              alt={combo.title}
              sizes="(min-width: 1024px) 45vw, 90vw"
              className="object-contain p-8"
              priority
            />
          </div>

          {images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {images.map((img, idx) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => setActiveImageIdx(idx)}
                  className={`relative aspect-square rounded-md overflow-hidden border-2 transition-colors ${
                    idx === activeImageIdx
                      ? "border-primary-500"
                      : "border-transparent hover:border-neutral-300"
                  }`}
                >
                  <Image
                    src={img.url}
                    fill
                    alt={img.altText ?? `${combo.title} ${idx + 1}`}
                    sizes="120px"
                    className="object-contain p-2 bg-neutral-100"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-5">
          <div>
            <p className="text-xs font-bold tracking-widest text-amber-600 uppercase mb-2">
              Combo Set
            </p>
            <h1 className="text-3xl font-semibold text-slate-900">
              {combo.title}
            </h1>
            {combo.titleTh && (
              <p className="text-slate-500 mt-1">{combo.titleTh}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <GoStarFill key={i} className="h-4 w-4 text-amber-400" />
            ))}
            <span className="text-sm text-slate-500">(0 reviews)</span>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-slate-900">
              ฿{comboPrice.toFixed(2)}
            </span>
            {hasDiscount && (
              <>
                <span className="text-lg text-slate-400 line-through">
                  ฿{totalPrice.toFixed(2)}
                </span>
                <span className="text-sm font-semibold text-emerald-600">
                  Save ฿{savings.toFixed(2)}
                </span>
              </>
            )}
          </div>

          {showShortDescription && (
            <div
              className="prose prose-sm max-w-none text-slate-600 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: combo.shortDescription! }}
            />
          )}

          <div className="flex flex-col gap-3 pt-2">
            <button
              type="button"
              className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white font-medium py-3 rounded-lg transition-colors"
            >
              <CgShoppingCart className="w-5 h-5" />
              Add Combo to Cart
            </button>
          </div>

          {/* Included items */}
          <div className="border-t border-neutral-200 pt-5">
            <p className="text-sm font-semibold text-slate-800 mb-3">
              What&apos;s included
            </p>
            <ul className="flex flex-col gap-3">
              {(combo.items ?? []).map((item) => (
                <li
                  key={item.id}
                  className="flex items-center gap-3 p-3 border border-neutral-200 rounded-lg"
                >
                  <div className="relative w-14 h-14 shrink-0 bg-neutral-100 rounded overflow-hidden">
                    {item.product?.primaryImageUrl && (
                      <Image
                        src={item.product.primaryImageUrl}
                        fill
                        alt={item.product.name}
                        sizes="56px"
                        className="object-contain p-1"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 line-clamp-1">
                      {item.product?.name ?? "Product"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {item.variant?.size ?? item.variant?.name ?? ""}
                      {item.variant && " · "}
                      Qty {item.quantity}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {showDescription && (
            <div className="border-t border-neutral-200 pt-5">
              <p className="text-sm font-semibold text-slate-800 mb-2">
                Description
              </p>
              <div
                className="prose prose-sm max-w-none text-slate-600"
                dangerouslySetInnerHTML={{ __html: combo.description! }}
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
