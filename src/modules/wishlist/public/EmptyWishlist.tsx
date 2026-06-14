import { Link } from "@/i18n/navigation";
import { IoMdHeartEmpty } from "react-icons/io";

export default function EmptyWishlist() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 gap-4">
      <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center">
        <IoMdHeartEmpty className="w-10 h-10 text-primary-500" />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-slate-800 font-semibold text-lg">
          Your wishlist is empty
        </p>
        <p className="text-slate-500 text-sm">
          Tap the heart on any product to save it for later.
        </p>
      </div>
      <Link
        href="/product"
        className="bg-mauve-700 hover:bg-primary-600 transition-colors text-white px-6 py-2.5 rounded-lg text-sm font-medium"
      >
        Browse Products
      </Link>
    </div>
  );
}
