import type { Metadata } from "next";
import { Suspense } from "react";
import LoadingPage from "@/components/shared/loading/LoadingPage";
import Cart from "@/modules/cart/public/Cart";
import { APP_NAME } from "@/constants/common.constants";

export const metadata: Metadata = {
  title: `My Cart | ${APP_NAME}`,
  description: "Review and manage items in your Essence Lab cart.",
};

export default function MyCartPage() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <Cart />
    </Suspense>
  );
}
