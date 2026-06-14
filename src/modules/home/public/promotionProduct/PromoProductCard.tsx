import { Link } from "@/i18n/navigation";
import Image from "next/image";

export default function PromoProductCard() {
  return (
    <div className="w-1/2 bg-secondary-50 p-12">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-7">
          <div className="flex flex-col gap-3">
            <p className="text-slate-500 text-sm">Home Medical Supplies</p>
            <p className="text-slate-800 text-2xl font-bold">
              Medicine Product
            </p>
          </div>
          <p className="text-text-error font-bold text-3xl">฿10.00-฿55.00</p>
          <Link
            href="/checkout"
            className="bg-mauve-700 px-6 py-3 text-slate-800 w-fit font-medium"
          >
            Buy Now
          </Link>
        </div>
        <div>
          <Image
            src="/images/home/promo-product1.png"
            alt="Promotion Product"
            width={204}
            height={290}
            className="w-51 h-51"
          />
        </div>
      </div>
    </div>
  );
}
