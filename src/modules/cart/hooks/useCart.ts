"use client";

import { useCallback, useMemo } from "react";
import { LocalStorageAdapter } from "@/lib/storage";
import { useStorageCollection } from "@/hooks/storage/useStorageCollection";
import { ICartItem } from "../types/cart.type";

const adapter = new LocalStorageAdapter<ICartItem>("thp:cart", "thp:cart:change");

const buildCartKey = (productId: number, variantId?: number) =>
  `${productId}${variantId ? `:${variantId}` : ""}`;

//* SALE PRICE WINS ONLY WHEN IT IS A POSITIVE NUMBER STRICTLY BELOW BASE PRICE.
//* GUARDS AGAINST salePrice: 0 OR salePrice >= basePrice FROM MALFORMED API DATA.
const effectivePrice = (item: ICartItem) =>
  typeof item.salePrice === "number" &&
  item.salePrice > 0 &&
  item.salePrice < item.basePrice
    ? item.salePrice
    : item.basePrice;

export const useCart = () => {
  const { items, isHydrated, count } = useStorageCollection(adapter);

  const addToCart = useCallback(
    (
      item: Omit<ICartItem, "id" | "addedAt" | "quantity"> & {
        quantity?: number;
      },
    ) => {
      const current = adapter.read();
      const id = buildCartKey(item.productId, item.variantId);
      const qty = item.quantity ?? 1;
      const existingIdx = current.findIndex((entry) => entry.id === id);

      if (existingIdx >= 0) {
        const next = [...current];
        next[existingIdx] = {
          ...next[existingIdx],
          quantity: next[existingIdx].quantity + qty,
        };
        adapter.write(next);
        return;
      }

      adapter.write([
        { ...item, id, quantity: qty, addedAt: new Date().toISOString() },
        ...current,
      ]);
    },
    [],
  );

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity < 1) return;
    const current = adapter.read();
    adapter.write(
      current.map((entry) => (entry.id === id ? { ...entry, quantity } : entry)),
    );
  }, []);

  const removeFromCart = useCallback((id: string) => {
    const current = adapter.read();
    adapter.write(current.filter((entry) => entry.id !== id));
  }, []);

  const clearCart = useCallback(() => {
    adapter.write([]);
  }, []);

  const totals = useMemo(() => {
    const subtotal = items.reduce(
      (acc, item) => acc + item.basePrice * item.quantity,
      0,
    );
    const payable = items.reduce(
      (acc, item) => acc + effectivePrice(item) * item.quantity,
      0,
    );
    const discount = Math.max(0, subtotal - payable);
    const deliveryCharge = items.length > 0 ? 5 : 0;
    const estimatedTotal = payable + deliveryCharge;
    const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);

    return { subtotal, discount, deliveryCharge, estimatedTotal, totalQuantity };
  }, [items]);

  return {
    items,
    isHydrated,
    count,
    totalQuantity: totals.totalQuantity,
    subtotal: totals.subtotal,
    discount: totals.discount,
    deliveryCharge: totals.deliveryCharge,
    estimatedTotal: totals.estimatedTotal,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  };
};
