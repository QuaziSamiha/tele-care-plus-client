"use client";

import { toast } from "react-toastify";
import { useCart } from "../hooks/useCart";
import CartItemRow from "./CartItemRow";
import EmptyCart from "./EmptyCart";
import OrderSummary from "./OrderSummary";

export default function Cart() {
  const {
    items,
    isHydrated,
    totalQuantity,
    subtotal,
    discount,
    deliveryCharge,
    estimatedTotal,
    updateQuantity,
    removeFromCart,
  } = useCart();

  if (!isHydrated) {
    return (
      <section className="container mx-auto px-4 py-14 mt-20 min-h-[60vh]">
        <div className="h-10 w-48 bg-neutral-200 rounded animate-pulse mb-3" />
        <div className="h-4 w-32 bg-neutral-200 rounded animate-pulse mb-10" />
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_24rem] gap-10">
          <div className="flex flex-col gap-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="flex gap-4 py-6 border-b border-neutralPrimary-300 animate-pulse"
              >
                <div className="w-32 h-32 bg-neutral-200 rounded-lg" />
                <div className="flex-1 flex flex-col gap-3">
                  <div className="h-4 w-2/3 bg-neutral-200 rounded" />
                  <div className="h-4 w-1/4 bg-neutral-200 rounded" />
                  <div className="h-10 w-32 bg-neutral-200 rounded mt-auto" />
                </div>
              </div>
            ))}
          </div>
          <div className="h-80 bg-neutral-100 rounded-xl animate-pulse" />
        </div>
      </section>
    );
  }

  const handleQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    updateQuantity(id, quantity);
  };

  const handleRemove = (id: string) => {
    removeFromCart(id);
    toast.success("Item removed from cart");
  };

  return (
    <section className="container mx-auto px-4 py-14 mt-20 min-h-[60vh]">
      <div className="mb-10">
        <h1 className="text-slate-900 text-3xl sm:text-4xl font-bold">
          My Cart
        </h1>
        <p className="text-slate-500 text-sm mt-2">
          Showing total {totalQuantity}{" "}
          {totalQuantity === 1 ? "item" : "items"}
        </p>
      </div>

      {items.length === 0 ? (
        <EmptyCart />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_24rem] gap-10 items-start">
          <div className="flex flex-col">
            <div className="grid grid-cols-[1fr_auto] gap-4 pb-3 border-b border-neutralPrimary-300">
              <span className="text-slate-500 text-sm font-medium tracking-wider uppercase">
                Product
              </span>
              <span className="text-slate-500 text-sm font-medium tracking-wider uppercase">
                Total
              </span>
            </div>

            {items.map((item) => (
              <CartItemRow
                key={item.id}
                item={item}
                onQuantityChange={handleQuantity}
                onRemove={handleRemove}
              />
            ))}
          </div>

          <OrderSummary
            subtotal={subtotal}
            discount={discount}
            deliveryCharge={deliveryCharge}
            estimatedTotal={estimatedTotal}
          />
        </div>
      )}
    </section>
  );
}
