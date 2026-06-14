import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { CgShoppingCart } from "react-icons/cg";
import { GoHeart, GoStarFill } from "react-icons/go";

interface IProps {
  id: number;
  name: string;
  imageSrc: string;
  price: number;
  discountPrice?: number;
  rating: number;
}

export default function ComboProductCard({ product }: { product: IProps }) {
  const hasDiscount =
    typeof product.discountPrice === "number" &&
    product.discountPrice > 0 &&
    product.discountPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
    : 0;

  return (
    <Link href="/" className="group block h-full">
      <div className="flex flex-col h-full gap-3">
        {/* Image area — fixed aspect for standard card size */}
        <div className="relative bg-neutral-100 rounded-lg overflow-hidden aspect-square">
          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1">
            <span className="bg-amber-500 text-white px-2 py-0.5 text-[10px] font-bold tracking-wide rounded">
              COMBO
            </span>
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
              aria-label="Add to wishlist"
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full border border-neutral-200 hover:border-slate-700 hover:bg-slate-700 p-1.5 bg-white"
            >
              <GoHeart className="text-neutral-500 hover:text-white h-4 w-4" />
            </button>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 group/cart cursor-pointer">
              <div className="flex items-center w-fit bg-slate-700 hover:bg-slate-800 rounded-full transition-all duration-300">
                <div className="p-1.5">
                  <CgShoppingCart className="w-4 h-4 text-white" />
                </div>
                <p className="text-white text-xs max-w-0 opacity-0 group-hover/cart:max-w-25 group-hover/cart:opacity-100 group-hover/cart:pr-3 transition-all duration-300 overflow-hidden whitespace-nowrap">
                  Add to Cart
                </p>
              </div>
            </div>
          </div>

          {/* Product image */}
          <Image
            src={product.imageSrc}
            width={300}
            height={300}
            alt={product.name}
            sizes="(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 45vw"
            className="absolute inset-0 w-full h-full object-contain p-5 transition-transform duration-300 group-hover:scale-105"
          />

          {/* Slide-up CTA */}
          <button
            type="button"
            className="absolute bottom-0 left-0 w-full bg-slate-700 text-white text-sm px-4 py-2.5 cursor-pointer translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out z-20"
          >
            Shop Now
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
                  ฿{product.discountPrice!.toFixed(2)}
                </span>
                <span className="text-slate-400 line-through text-xs">
                  ฿{product.price.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="font-semibold text-slate-900">
                ฿{product.price.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
