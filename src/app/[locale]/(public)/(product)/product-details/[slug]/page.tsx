import LoadingPage from "@/components/shared/loading/LoadingPage";
import ProductDetails from "@/modules/product/public/productDetails/ProductDetails";
import { Suspense } from "react";

export default function ProductDetailsPage() {
  return (
    // Suspense handles the loading state if ProductDetails
    // is doing any asynchronous work or if you want
    // a clean wrapper around the client-side data fetch.
    <Suspense fallback={<LoadingPage />}>
      <ProductDetails />
    </Suspense>
  );
}
