"use client";

import { useCallback } from "react";
import { LocalStorageAdapter } from "@/lib/storage";
import { useStorageCollection } from "@/hooks/storage/useStorageCollection";
import { IWishlistItem } from "../types/wishlist.type";

const adapter = new LocalStorageAdapter<IWishlistItem>(
  "thp:wishlist",
  "thp:wishlist:change",
);

export const useWishlist = () => {
  const { items, isHydrated, count } = useStorageCollection(adapter);

  const isInWishlist = useCallback(
    (id: number) => items.some((item) => item.id === id),
    [items],
  );

  const addToWishlist = useCallback((item: IWishlistItem) => {
    const current = adapter.read();
    if (current.some((entry) => entry.id === item.id)) return;
    adapter.write([{ ...item, addedAt: new Date().toISOString() }, ...current]);
  }, []);

  const removeFromWishlist = useCallback((id: number) => {
    const current = adapter.read();
    adapter.write(current.filter((entry) => entry.id !== id));
  }, []);

  const toggleWishlist = useCallback((item: IWishlistItem) => {
    const current = adapter.read();
    const exists = current.some((entry) => entry.id === item.id);
    if (exists) {
      adapter.write(current.filter((entry) => entry.id !== item.id));
      return false;
    }
    adapter.write([{ ...item, addedAt: new Date().toISOString() }, ...current]);
    return true;
  }, []);

  const clearWishlist = useCallback(() => {
    adapter.write([]);
  }, []);

  return {
    items,
    isHydrated,
    count,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    clearWishlist,
  };
};
