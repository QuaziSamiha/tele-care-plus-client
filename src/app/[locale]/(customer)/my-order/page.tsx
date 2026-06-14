
import LoadingPage from "@/components/shared/loading/LoadingPage";
import MyOrder from "@/modules/order/customer/myOrder/MyOrder";
import { Suspense } from "react";

export default function MyOrderPage() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <MyOrder />
    </Suspense>
  );
}
