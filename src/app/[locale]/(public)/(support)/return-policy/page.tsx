import LoadingPage from "@/components/shared/loading/LoadingPage";
import ReturnPolicy from "@/modules/support/public/ReturnPolicy";
import { Suspense } from "react";

export default function ReturnPolicyPage() {
  return (
    // Suspense handles the loading state if ReturnPolicy
    // is doing any asynchronous work or if you want
    // a clean wrapper around the client-side data fetch.
    <Suspense fallback={<LoadingPage />}>
      <ReturnPolicy />
    </Suspense>
  );
}
