"use client";

import { toast } from "react-toastify";
import { IoMdHeartEmpty } from "react-icons/io";
import { useWishlist } from "../hooks/useWishlist";
import EmptyWishlist from "./EmptyWishlist";
import WishlistCard from "./WishlistCard";

export default function Wishlist() {
  const { items, isHydrated, removeFromWishlist, clearWishlist } =
    useWishlist();

  if (!isHydrated) {
    return (
      <section className="flex-1 w-full">
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col gap-3 border border-neutralPrimary-300 rounded-xl p-3 animate-pulse"
            >
              <div className="bg-neutral-200 aspect-square rounded-lg" />
              <div className="h-4 w-3/4 bg-neutral-200 rounded" />
              <div className="h-4 w-1/3 bg-neutral-200 rounded" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  const handleRemove = (id: number) => {
    removeFromWishlist(id);
    toast.success("Removed from wishlist");
  };

  const handleClear = () => {
    if (items.length === 0) return;
    clearWishlist();
    toast.success("Wishlist cleared");
  };

  return (
    <section className="flex-1 w-full">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutralPrimary-300">
        <div className="flex items-center gap-2">
          <IoMdHeartEmpty className="w-6 h-6 text-primary-500" />
          <h1 className="text-xl font-semibold text-slate-800">
            My Wishlist
            {items.length > 0 && (
              <span className="ml-2 text-sm font-normal text-slate-500">
                ({items.length})
              </span>
            )}
          </h1>
        </div>

        {items.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            className="text-sm text-rose-500 hover:text-rose-600 font-medium cursor-pointer transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <EmptyWishlist />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.map((item) => (
            <WishlistCard
              key={item.id}
              item={item}
              onRemove={handleRemove}
            />
          ))}
        </div>
      )}
    </section>
  );
}
