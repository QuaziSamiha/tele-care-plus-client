import LoadingPage from "@/components/shared/loading/LoadingPage";
import ComboDetails from "@/modules/combo/public/comboDetails/ComboDetails";
import { Suspense } from "react";

export default function ComboDetailsPage() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <ComboDetails />
    </Suspense>
  );
}
