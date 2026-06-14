import LoadingPage from "@/components/shared/loading/LoadingPage";
import TermsConditions from "@/modules/support/public/TermsConditions";
import { Suspense } from "react";

export default function TermsConditionsPage() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <TermsConditions />
    </Suspense>
  );
}
