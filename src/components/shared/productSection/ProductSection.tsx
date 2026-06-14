import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { CgShoppingCart } from "react-icons/cg";
import { GoHeart, GoStarFill } from "react-icons/go";

interface IProduct {
  id: number;
  name: string;
  imageSrc: string;
  price: number;
  discountPrice?: number;
  rating?: number;
}

export default function ProductSection({
  title,
  products,
}: {
  title: string;
  products: IProduct[];
}) {
  return (
    <section className="w-full flex flex-col gap-8 lg:gap-12">
      <div className="flex items-end justify-between">
        <h2 className="text-neutral-900 font-bold text-3xl md:text-4xl lg:text-5xl tracking-tight">
          {title}
        </h2>
        <Link
          href="/product"
          className="group flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-2.5 rounded-full border border-neutral-200 text-sm sm:text-base font-semibold text-neutral-600 hover:text-primary-600 hover:border-primary-200 hover:bg-primary-50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
        >
          <span>View All</span>
          <svg
            className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>
      <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
        {products.map((product) => (
          <SimpleProductCard key={product.id} product={product} />
        ))}
      </main>
    </section>
  );
}

function SimpleProductCard({ product }: { product: IProduct }) {
  const hasDiscount =
    typeof product.discountPrice === "number" &&
    product.discountPrice > 0 &&
    product.discountPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
    : 0;

  return (
    <Link href="/product" className="group block h-full">
      <div className="flex flex-col h-full gap-3">
        {/* Image area — fixed aspect for standard card size */}
        <div className="relative bg-neutral-100 rounded-lg overflow-hidden aspect-square">
          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1">
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
