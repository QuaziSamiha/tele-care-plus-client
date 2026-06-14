import LoadingPage from "@/components/shared/loading/LoadingPage";
import CancellationPolicy from "@/modules/support/public/CancellationPolicy";
import { Suspense } from "react";

export default function CancellationPolicyPage() {
  return (
    // Suspense handles the loading state if DeliveryPolicy
    // is doing any asynchronous work or if you want
    // a clean wrapper around the client-side data fetch.
    <Suspense fallback={<LoadingPage />}>
      <CancellationPolicy />
    </Suspense>
  );
}
