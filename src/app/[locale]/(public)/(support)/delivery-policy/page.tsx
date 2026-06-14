import LoadingPage from "@/components/shared/loading/LoadingPage";
import DeliveryPolicy from "@/modules/support/public/DeliveryPolicy";
import { Suspense } from "react";

export default function DeliveryPolicyPage() {
  return (
    // Suspense handles the loading state if DeliveryPolicy
    // is doing any asynchronous work or if you want
    // a clean wrapper around the client-side data fetch.
    <Suspense fallback={<LoadingPage />}>
      <DeliveryPolicy />
    </Suspense>
  );
}
