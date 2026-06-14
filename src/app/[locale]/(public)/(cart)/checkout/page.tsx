import type { Metadata } from "next";
import { Suspense } from "react";
import LoadingPage from "@/components/shared/loading/LoadingPage";
import Checkout from "@/modules/checkout/public/Checkout";
import { APP_NAME } from "@/constants/common.constants";

export const metadata: Metadata = {
  title: `Checkout | ${APP_NAME}`,
  description: "Complete your Essence Lab order securely.",
};

export default function CheckoutPage() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <Checkout />
    </Suspense>
  );
}
