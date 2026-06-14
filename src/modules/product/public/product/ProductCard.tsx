"use client";

import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { MouseEvent } from "react";
import { toast } from "react-toastify";
import { CgShoppingCart } from "react-icons/cg";
import { GoHeart, GoHeartFill, GoStarFill } from "react-icons/go";
import { useWishlist } from "@/modules/wishlist/hooks/useWishlist";
import { useCart } from "@/modules/cart/hooks/useCart";
import { IProduct, ProductType, StockStatus } from "../../types/product.type";

interface IProps {
  product: IProduct;
}

export default function ProductCard({ product }: IProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const primaryImage =
    product.images?.find((img) => img.isPrimary) ?? product.images?.[0];
  const imageUrl = primaryImage?.url ?? "/images/home/product-placeholder.png";

  const defaultVariant =
    product.variants?.find((v) => v.isDefault) ?? product.variants?.[0];
  const basePrice = defaultVariant?.price ?? product.basePrice ?? 0;
  const salePrice = defaultVariant?.salePrice ?? product.salePrice;
  const hasDiscount =
    typeof salePrice === "number" && salePrice > 0 && salePrice < basePrice;
  const discountPercent = hasDiscount
    ? Math.round(((basePrice - salePrice!) / basePrice) * 100)
    : 0;
  const isCombo = product.type === ProductType.COMBO;
  const detailsHref = isCombo
    ? `/combo-product-details/${product.slug}`
    : `/product-details/${product.slug}`;

  const wishlisted = isInWishlist(product.id);
  const isOutOfStock = product.stockStatus === StockStatus.OUT_OF_STOCK;

  const handleAddToCart = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) {
      toast.error("This product is currently out of stock");
      return;
    }
    addToCart({
      productId: product.id,
      variantId: defaultVariant?.id,
      slug: product.slug,
      name: product.name,
      imageUrl,
      basePrice,
      salePrice: typeof salePrice === "number" ? salePrice : undefined,
      size: defaultVariant?.size,
      type: product.type,
    });
    toast.success("Added to cart");
  };

  const handleWishlistClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleWishlist({
      id: product.id,
      slug: product.slug,
      name: product.name,
      imageUrl,
      basePrice,
      salePrice: typeof salePrice === "number" ? salePrice : undefined,
      type: product.type,
      addedAt: new Date().toISOString(),
    });
    toast.success(added ? "Added to wishlist" : "Removed from wishlist");
  };

  return (
    <Link
      href={detailsHref}
      className="group block h-full"
    >
      <div className="flex flex-col h-full gap-3">
        {/* Image area — fixed aspect for standard card size */}
        <div className="relative bg-neutral-100 rounded-lg overflow-hidden aspect-square">
          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1">
            {isCombo && (
              <span className="bg-amber-500 text-white px-2 py-0.5 text-[10px] font-bold tracking-wide rounded">
                COMBO
              </span>
            )}
            {hasDiscount && (
              <span className="bg-mauve-700 text-white px-2 py-0.5 text-xs font-semibold rounded">
                -{discountPercent}%
              </span>
            )}
          </div>

          {/* Wishlist + quick cart */}
          <div className="absolute top-2.5 right-2.5 z-10 flex items-start gap-1.5">
            <button
              type="button"
              aria-label={
                wishlisted ? "Remove from wishlist" : "Add to wishlist"
              }
              aria-pressed={wishlisted}
              onClick={handleWishlistClick}
              className={`${
                wishlisted
                  ? "opacity-100 border-rose-400 bg-white"
                  : "opacity-0 group-hover:opacity-100 border-neutral-200 hover:border-slate-700 hover:bg-slate-700 bg-white"
              } transition-all duration-300 rounded-full border p-1.5 cursor-pointer`}
            >
              {wishlisted ? (
                <GoHeartFill className="text-rose-500 h-4 w-4" />
              ) : (
                <GoHeart className="text-neutral-500 hover:text-white h-4 w-4" />
              )}
            </button>
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              aria-label="Add to cart"
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 group/cart cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
            >
              <div className="flex items-center w-fit bg-slate-700 hover:bg-slate-800 rounded-full transition-all duration-300">
                <div className="p-1.5">
                  <CgShoppingCart className="w-4 h-4 text-white" />
                </div>
                <p className="text-white text-xs max-w-0 opacity-0 group-hover/cart:max-w-25 group-hover/cart:opacity-100 group-hover/cart:pr-3 transition-all duration-300 overflow-hidden whitespace-nowrap">
                  Add to Cart
                </p>
              </div>
            </button>
          </div>

          {/* Product image */}
          <Image
            src={imageUrl}
            width={300}
            height={300}
            alt={product.name}
            sizes="(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 45vw"
            className="absolute inset-0 w-full h-full object-contain p-5 transition-transform duration-300 group-hover:scale-105"
          />

          {/* Slide-up CTA */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="absolute bottom-0 left-0 w-full bg-slate-700 hover:bg-slate-800 disabled:bg-slate-400 disabled:cursor-not-allowed text-white text-sm px-4 py-2.5 cursor-pointer translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out z-20"
          >
            {isOutOfStock ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>

        {/* Name, ratings, price */}
        <div className="flex flex-col gap-1 text-slate-800 mt-auto">
          <p className="line-clamp-1 text-sm font-medium">{product.name}</p>
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <GoStarFill key={i} className="h-3 w-3 text-amber-400" />
            ))}
          </div>
          <div className="flex items-center gap-2 text-sm">
            {hasDiscount ? (
              <>
                <span className="font-semibold text-slate-900">
                  ฿{salePrice!.toFixed(2)}
                </span>
                <span className="text-slate-400 line-through text-xs">
                  ฿{basePrice.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="font-semibold text-slate-900">
                ฿{basePrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
