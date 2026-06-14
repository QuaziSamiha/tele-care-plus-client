
import LoadingPage from "@/components/shared/loading/LoadingPage";
import Product from "@/modules/product/public/product/Product";
import { Suspense } from "react";

export default function ProductPage() {
  return (
    // Suspense handles the loading state if Product
    // is doing any asynchronous work or if you want
    // a clean wrapper around the client-side data fetch.
    <Suspense fallback={<LoadingPage />}>
      <Product />
    </Suspense>
  );
}
