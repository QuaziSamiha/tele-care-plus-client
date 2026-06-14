"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { GoHeartFill, GoStarFill } from "react-icons/go";
import { FiHeart, FiTruck, FiShield, FiRefreshCw, FiAward, FiChevronRight } from "react-icons/fi";

import CustomTabGroup from "@/components/shared/customTab/CustomTabGroup";
import QuantityCounter from "@/components/shared/quantityCounter/QuantityCounter";
import { useCart } from "@/modules/cart/hooks/useCart";
import { useWishlist } from "@/modules/wishlist/hooks/useWishlist";
import { useGetProductBySlug } from "../../hooks/usePublicProduct";
import { IProductVariant, StockStatus } from "../../types/product.type";

const stockBadge = (status?: string) => {
  switch (status) {
    case StockStatus.IN_STOCK:
      return { label: "In Stock", className: "bg-emerald-50 text-emerald-700 ring-emerald-200" };
    case StockStatus.LOW_STOCK:
      return { label: "Low Stock", className: "bg-amber-50 text-amber-700 ring-amber-200" };
    case StockStatus.OUT_OF_STOCK:
      return { label: "Out of Stock", className: "bg-rose-50 text-rose-700 ring-rose-200" };
    default:
      return { label: "Available", className: "bg-slate-50 text-slate-700 ring-slate-200" };
  }
};

const TRUST_BADGES = [
  { icon: FiTruck, title: "Free Shipping", desc: "On orders over ฿1,500" },
  { icon: FiShield, title: "Secure Payment", desc: "100% encrypted checkout" },
  { icon: FiRefreshCw, title: "Easy Returns", desc: "7-day return policy" },
  { icon: FiAward, title: "Authentic", desc: "Verified by Thai Health" },
];

export default function ProductDetails() {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading } = useGetProductBySlug(slug);
  const product = data?.data;

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [quantity, setQuantity] = useState(1);
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);

  const variants = product?.variants ?? [];
  const activeVariant: IProductVariant | undefined = useMemo(() => {
    if (!variants.length) return undefined;
    return (
      variants.find((v) => v.id === selectedVariantId) ??
      variants.find((v) => v.isDefault) ??
      variants[0]
    );
  }, [variants, selectedVariantId]);

  const images = product?.images ?? [];
  const primaryImage = images[selectedImageIdx] ?? images[0];

  const basePrice = activeVariant?.price ?? product?.basePrice ?? 0;
  const salePrice = activeVariant?.salePrice ?? product?.salePrice;
  const hasDiscount =
    typeof salePrice === "number" && salePrice > 0 && salePrice < basePrice;
  const displayPrice = hasDiscount ? salePrice! : basePrice;
  const discountPct =
    hasDiscount && basePrice > 0
      ? Math.round(((basePrice - salePrice!) / basePrice) * 100)
      : 0;

  const stockStatus = activeVariant?.stockStatus ?? product?.stockStatus;
  const stockInfo = stockBadge(stockStatus);
  const isOutOfStock = stockStatus === StockStatus.OUT_OF_STOCK;

  const wishlisted = product ? isInWishlist(product.id) : false;
  const primaryImageUrl =
    primaryImage?.url ?? "/images/home/product-placeholder.png";

  const handleAddToCart = () => {
    if (!product || isOutOfStock) return;
    addToCart({
      productId: product.id,
      variantId: activeVariant?.id,
      slug: product.slug,
      name: product.name,
      imageUrl: primaryImageUrl,
      basePrice,
      salePrice: typeof salePrice === "number" ? salePrice : undefined,
      size: activeVariant?.size,
      type: product.type,
      quantity,
    });
    toast.success("Added to cart");
  };

  const handleToggleWishlist = () => {
    if (!product) return;
    const added = toggleWishlist({
      id: product.id,
      slug: product.slug,
      name: product.name,
      imageUrl: primaryImageUrl,
      basePrice,
      salePrice: typeof salePrice === "number" ? salePrice : undefined,
      type: product.type,
      addedAt: new Date().toISOString(),
    });
    toast.success(added ? "Added to wishlist" : "Removed from wishlist");
  };

  if (isLoading) {
    return (
      <section className="container mx-auto max-lg:px-4 lg:px-8 xl:px-0 py-8 mt-32 mb-20 ">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-14 animate-pulse">
          <div className="bg-neutral-200 h-80 sm:h-96 lg:h-[480px] xl:h-[520px] rounded-2xl" />
          <div className="flex flex-col gap-4">
            <div className="h-6 w-40 bg-neutral-200 rounded" />
            <div className="h-10 w-3/4 bg-neutral-200 rounded" />
            <div className="h-4 w-32 bg-neutral-200 rounded" />
            <div className="h-8 w-24 bg-neutral-200 rounded" />
            <div className="h-24 w-full bg-neutral-200 rounded" />
            <div className="h-12 w-1/2 bg-neutral-200 rounded" />
          </div>
        </div>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="container mx-auto px-4 py-8 mt-32 mb-20">
        <div className="text-center text-slate-500 py-16">Product not found.</div>
      </section>
    );
  }

  const tabList = [
    { label: "Description", value: "description" },
    { label: "Additional information", value: "additionalInformation" },
  ];

  const tabContent = [
    {
      value: "description",
      content: product.description ? (
        <div
          className="rich-text-container max-w-none text-slate-600 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: product.description }}
        />
      ) : (
        <p className="text-slate-500">No description available.</p>
      ),
    },
    {
      value: "additionalInformation",
      content: (
        <section className="py-2">
          <div className="border-t border-slate-100">
            {[
              { label: "Generic", value: product.genericName, isHtml: false },
              { label: "Origin", value: product.origin, isHtml: false },
              { label: "Dosage", value: product.dosage, isHtml: true },
              { label: "Ingredients", value: product.ingredients, isHtml: true },
              { label: "Health Benefits", value: product.healthBenefits, isHtml: true },
              { label: "Warning", value: product.warning, isHtml: true },
              { label: "Storage Instructions", value: product.storageInstructions, isHtml: true },
            ]
              .filter((row) => Boolean(row.value))
              .map((info, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-[250px_1fr] items-start border-b border-slate-100 py-4 px-2"
                >
                  <span className="text-slate-800 font-bold text-base">{info.label}</span>
                  {info.isHtml ? (
                    <div
                      className="rich-text-container max-w-none text-slate-500 text-base mt-1 md:mt-0 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: info.value! }}
                    />
                  ) : (
                    <span className="text-slate-500 text-base mt-1 md:mt-0">{info.value}</span>
                  )}
                </div>
              ))}
          </div>
        </section>
      ),
    },
  ];

  return (
    <section className="bg-white pt-32 pb-20 px-6">
      <div className="container mx-auto max-lg:px-4 lg:px-8 xl:px-0">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-sm text-slate-500 mb-8">
          <Link href="/" className="hover:text-primary-600 transition-colors">
            Home
          </Link>
          <FiChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link href="/product" className="hover:text-primary-600 transition-colors">
            Products
          </Link>
          {product.category && (
            <>
              <FiChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <Link
                href={`/product?categoryIds=${product.category.id}`}
                className="hover:text-primary-600 transition-colors"
              >
                {product.category.name}
              </Link>
            </>
          )}
          <FiChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-700 font-medium truncate max-w-[200px]">
            {product.name}
          </span>
        </nav>

        <main className="flex flex-col gap-20">
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">
            {/* LEFT: Image gallery */}
            <div className="flex flex-col-reverse lg:flex-row gap-4">
              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex lg:flex-col gap-3 lg:w-20 overflow-x-auto lg:overflow-y-auto">
                  {images.map((img, idx) => (
                    <button
                      key={img.id}
                      type="button"
                      onClick={() => setSelectedImageIdx(idx)}
                      className={`relative aspect-square w-20 shrink-0 bg-neutral-50 rounded-xl border-2 transition-all ${idx === selectedImageIdx
                        ? "border-primary-500 ring-2 ring-primary-100"
                        : "border-slate-100 hover:border-slate-300"
                        }`}
                    >
                      <Image
                        src={img.url}
                        alt={`${product.name} ${idx + 1}`}
                        fill
                        sizes="80px"
                        className="object-contain p-2"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Main image */}
              <div className="relative flex-1 bg-neutral-50 rounded-2xl border border-slate-100 overflow-hidden h-80 sm:h-96 lg:h-[480px] xl:h-[520px]">
                {hasDiscount && (
                  <span className="absolute top-4 left-4 z-10 bg-rose-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                    −{discountPct}%
                  </span>
                )}
                {product.isFeatured && (
                  <span className="absolute top-4 right-4 z-10 bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1.5 rounded-full ring-1 ring-amber-200">
                    Featured
                  </span>
                )}
                {primaryImage ? (
                  <Image
                    src={primaryImage.url}
                    alt={product.name}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-contain p-6 md:p-8"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-neutral-400">
                    No image
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT: Info */}
            <div className="flex flex-col gap-6">
              {/* Header: category + title + rating */}
              <div className="flex flex-col gap-3">
                {product.category && (
                  <Link
                    href={`/product?categoryIds=${product.category.id}`}
                    className="text-xs font-semibold uppercase tracking-widest text-primary-600 hover:text-mauve-800 transition-colors w-fit"
                  >
                    {product.category.name}
                  </Link>
                )}
                <h1 className="text-slate-900 font-bold max-md:text-2xl text-3xl md:text-4xl leading-tight">
                  {product.name}
                </h1>
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <GoStarFill key={i} className="h-4 w-4 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-sm text-slate-500">
                    <span className="font-semibold text-slate-700">5.0</span> · 0 reviews
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ring-1 ${stockInfo.className}`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    {stockInfo.label}
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-baseline flex-wrap gap-3 pb-6 border-b border-slate-100">
                <p className="text-3xl font-bold text-slate-900">
                  ฿{displayPrice.toFixed(2)}
                </p>
                {hasDiscount && (
                  <>
                    <p className="text-lg text-slate-400 line-through">
                      ฿{basePrice.toFixed(2)}
                    </p>
                    <span className="text-sm font-semibold text-rose-600">
                      You save ฿{(basePrice - salePrice!).toFixed(2)}
                    </span>
                  </>
                )}
              </div>

              {/* Short description */}
              {product.shortDescription && (
                <div
                  className="rich-text-container max-w-xl text-slate-600 text-base leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: product.shortDescription }}
                />
              )}

              {/* Variants */}
              {variants.length > 0 && (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-slate-800">
                      Size:{" "}
                      <span className="text-slate-500 font-normal">
                        {activeVariant?.size ?? activeVariant?.name}
                      </span>
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {variants.map((v) => {
                      const isSelected = v.id === activeVariant?.id;
                      const variantOOS = v.stockStatus === StockStatus.OUT_OF_STOCK;
                      return (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => setSelectedVariantId(v.id)}
                          disabled={variantOOS}
                          className={`relative min-w-[72px] px-5 py-2.5 text-sm rounded-lg transition-all ${isSelected
                            ? "border-2 border-primary-600 bg-primary-50 text-mauve-800 font-semibold"
                            : "border border-slate-200 text-slate-700 font-medium hover:border-slate-400 hover:bg-slate-50"
                            } ${variantOOS ? "opacity-40 cursor-not-allowed line-through" : "cursor-pointer"}`}
                        >
                          {v.size ?? v.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity + actions */}
              <div className="flex flex-col gap-3 pt-2">
                <div className="flex flex-wrap items-center gap-3">
                  <QuantityCounter
                    value={quantity}
                    valueChange={(val: number) => setQuantity(val)}
                    minValue={1}
                  />

                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className="flex-1 min-w-[180px] cursor-pointer bg-mauve-700 hover:bg-primary-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold h-12 px-8 rounded-lg transition-colors"
                  >
                    {isOutOfStock ? "Out of Stock" : "Add to cart"}
                  </button>

                  <button
                    type="button"
                    onClick={handleToggleWishlist}
                    aria-label={
                      wishlisted ? "Remove from wishlist" : "Add to wishlist"
                    }
                    aria-pressed={wishlisted}
                    className={`flex items-center justify-center border h-12 w-12 rounded-lg cursor-pointer transition-all ${
                      wishlisted
                        ? "border-rose-200 bg-rose-50 text-rose-500"
                        : "border-slate-200 text-slate-500 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50"
                    }`}
                  >
                    {wishlisted ? (
                      <GoHeartFill className="w-5 h-5" />
                    ) : (
                      <FiHeart className="w-5 h-5" />
                    )}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="cursor-pointer bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold h-12 px-8 rounded-lg transition-colors"
                >
                  Buy it now
                </button>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
                {TRUST_BADGES.map((b) => (
                  <div
                    key={b.title}
                    className="flex items-start gap-3 p-3 rounded-lg bg-slate-50/60"
                  >
                    <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary-50 text-primary-600 shrink-0">
                      <b.icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800 leading-tight">
                        {b.title}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Meta */}
              <div className="grid grid-cols-1 gap-2 pt-4 border-t border-slate-100 text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-800 w-24">SKU:</span>
                  <span className="text-slate-500">
                    {activeVariant?.sku ?? product.sku ?? "N/A"}
                  </span>
                </div>
                {product.category && (
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800 w-24">Category:</span>
                    <Link
                      href={`/product?categoryIds=${product.category.id}`}
                      className="text-primary-600 hover:text-mauve-800 transition-colors"
                    >
                      {product.category.name}
                    </Link>
                  </div>
                )}
                {product.genericName && (
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800 w-24">Generic:</span>
                    <span className="text-slate-500">{product.genericName}</span>
                  </div>
                )}
                {product.tags?.length > 0 && (
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-slate-800 w-24 shrink-0">Tags:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {product.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Tabs */}
          <div className="border-t border-slate-100 pt-10">
            <CustomTabGroup
              tabList={tabList}
              tabContent={tabContent}
              defaultTab="description"
            />
          </div>
        </main>
      </div>
    </section>
  );
}
