"use client";

import { useMemo, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useRouter } from "@/i18n/navigation";

import InputField from "@/components/shared/form/InputField";
import SingleSelectSearch from "@/components/shared/form/SingleSelectSearch";
import { useCart } from "@/modules/cart/hooks/useCart";

import {
  CHECKOUT_REGIONS,
  CHECKOUT_STATES,
} from "../constants/checkout.constants";
import {
  CheckoutFormValues,
  checkoutSchema,
} from "../schemas/checkout.schema";
import { IPromoCode, PaymentMethod } from "../types/checkout.type";
import CheckoutSummary from "./CheckoutSummary";
import PaymentMethodSelector from "./PaymentMethodSelector";
import PromoCodeInput from "./PromoCodeInput";

const computePromoDiscount = (subtotal: number, promo: IPromoCode | null) => {
  if (!promo) return 0;
  if (promo.type === "PERCENTAGE") {
    return Math.min(subtotal, (subtotal * promo.value) / 100);
  }
  return Math.min(subtotal, promo.value);
};

export default function Checkout() {
  const router = useRouter();
  const {
    items,
    isHydrated,
    subtotal,
    discount: cartDiscount,
    deliveryCharge,
    clearCart,
  } = useCart();

  const [appliedPromo, setAppliedPromo] = useState<IPromoCode | null>(null);

  const { control, trigger, handleSubmit, watch, setValue } =
    useForm<CheckoutFormValues>({
      resolver: zodResolver(checkoutSchema),
      defaultValues: {
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        street: "",
        state: "",
        region: "",
        zipCode: "",
        paymentMethod: undefined as unknown as PaymentMethod,
      },
    });

  const selectedState = watch("state");
  const regionOptions = useMemo(
    () => (selectedState ? CHECKOUT_REGIONS[selectedState] ?? [] : []),
    [selectedState],
  );

  const promoDiscount = useMemo(
    () => computePromoDiscount(subtotal - cartDiscount, appliedPromo),
    [subtotal, cartDiscount, appliedPromo],
  );
  const totalDiscount = cartDiscount + promoDiscount;
  const total = Math.max(0, subtotal - totalDiscount) + deliveryCharge;

  if (isHydrated && items.length === 0) {
    return (
      <section className="container mx-auto px-4 py-20 mt-20 min-h-[60vh] text-center">
        <h1 className="text-slate-900 text-3xl font-bold mb-3">Checkout</h1>
        <p className="text-slate-500 mb-6">
          Your cart is empty. Add a product before checking out.
        </p>
        <button
          type="button"
          onClick={() => router.push("/product")}
          className="bg-mauve-700 hover:bg-primary-600 transition-colors text-white px-6 py-2.5 rounded-md cursor-pointer"
        >
          Browse Products
        </button>
      </section>
    );
  }

  const onSubmit: SubmitHandler<CheckoutFormValues> = (data) => {
    const orderPayload = {
      customer: {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        email: data.email,
      },
      billingAddress: {
        street: data.street,
        state: data.state,
        region: data.region,
        zipCode: data.zipCode,
      },
      paymentMethod: data.paymentMethod,
      promoCode: appliedPromo?.code ?? null,
      items: items.map((item) => ({
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
      })),
      totals: {
        subtotal,
        discount: totalDiscount,
        deliveryCharge,
        total,
      },
    };

    // TODO: replace with real order API call
    console.log("ORDER PAYLOAD:", orderPayload);

    clearCart();
    toast.success("Order placed successfully");
    router.push("/my-order");
  };

  return (
    <section className="container mx-auto px-4 py-14 mt-20">
      <h1 className="text-slate-900 text-3xl sm:text-4xl font-bold mb-10">
        Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_24rem] gap-10 items-start">
        <form
          id="checkout-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-10"
        >
          {/* Personal Information */}
          <section className="flex flex-col gap-6">
            <h2 className="text-slate-900 text-xl font-semibold">
              Personal information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                labelName="First Name"
                name="firstName"
                placeholderText="Enter your first name"
                control={control}
                trigger={trigger}
                isRequired
              />
              <InputField
                labelName="Last Name"
                name="lastName"
                placeholderText="Enter your last name"
                control={control}
                trigger={trigger}
                isRequired
              />
              <InputField
                labelName="Phone Number"
                name="phone"
                placeholderText="Enter phone number"
                control={control}
                trigger={trigger}
                isRequired
              />
              <InputField
                labelName="Email"
                name="email"
                inputType="email"
                placeholderText="Enter your email"
                control={control}
                trigger={trigger}
                isRequired
              />
            </div>
          </section>

          {/* Billing Address */}
          <section className="flex flex-col gap-6">
            <h2 className="text-slate-900 text-xl font-semibold">
              Billing Address
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                labelName="Street Name & House Number"
                name="street"
                placeholderText="Enter your house number"
                control={control}
                trigger={trigger}
                isRequired
              />
              <SingleSelectSearch
                labelName="Select State"
                name="state"
                options={CHECKOUT_STATES}
                control={control}
                isRequired
                onSelectionChange={() => setValue("region", "")}
              />
              <SingleSelectSearch
                labelName="Select Region"
                name="region"
                options={regionOptions}
                control={control}
                isRequired
                isDisabled={!selectedState}
              />
              <InputField
                labelName="ZIP Code"
                name="zipCode"
                placeholderText="ZIP Code"
                control={control}
                trigger={trigger}
                isRequired
              />
            </div>
          </section>

          {/* Promo Code */}
          <section className="flex flex-col gap-6">
            <h2 className="text-slate-900 text-xl font-semibold">
              Promo Code
            </h2>
            <PromoCodeInput
              appliedPromo={appliedPromo}
              onApply={setAppliedPromo}
              onClear={() => setAppliedPromo(null)}
            />
          </section>

          {/* Payment Method */}
          <section className="flex flex-col gap-4">
            <h2 className="text-slate-900 text-xl font-semibold">
              Payment Method
            </h2>
            <PaymentMethodSelector name="paymentMethod" control={control} />
          </section>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => router.push("/my-cart")}
              className="border border-neutralPrimary-300 hover:bg-neutral-50 transition-colors text-slate-700 font-semibold px-10 py-3 rounded-md cursor-pointer"
            >
              Back
            </button>
            <button
              type="submit"
              className="bg-mauve-700 hover:bg-primary-600 transition-colors text-white font-semibold px-10 py-3 rounded-md cursor-pointer"
            >
              Place Order
            </button>
          </div>
        </form>

        <CheckoutSummary
          items={items}
          subtotal={subtotal}
          discount={totalDiscount}
          deliveryCharge={deliveryCharge}
          total={total}
        />
      </div>
    </section>
  );
}
