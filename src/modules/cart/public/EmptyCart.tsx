import { Link } from "@/i18n/navigation";
import { LiaShoppingBagSolid } from "react-icons/lia";

export default function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 gap-4">
      <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center">
        <LiaShoppingBagSolid className="w-10 h-10 text-primary-500" />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-slate-800 font-semibold text-lg">
          Your cart is empty
        </p>
        <p className="text-slate-500 text-sm">
          Looks like you haven't added anything yet. Let's fix that.
        </p>
      </div>
      <Link
        href="/product"
        className="bg-mauve-700 hover:bg-primary-600 transition-colors text-white px-6 py-2.5 rounded-lg text-sm font-medium"
      >
        Continue Shopping
      </Link>
    </div>
  );
}
