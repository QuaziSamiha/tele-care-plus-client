import LoadingPage from "@/components/shared/loading/LoadingPage";
import PrivacyPolicy from "@/modules/support/public/PrivacyPolicy";
import { Suspense } from "react";

export default function PrivacyPolicyPage() {
  return (
    // Suspense handles the loading state if DeliveryPolicy
    // is doing any asynchronous work or if you want
    // a clean wrapper around the client-side data fetch.
    <Suspense fallback={<LoadingPage />}>
      <PrivacyPolicy />
    </Suspense>
  );
}
