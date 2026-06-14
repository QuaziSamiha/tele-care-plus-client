import LoadingPage from "@/components/shared/loading/LoadingPage";
import Wishlist from "@/components/customer/wishlist/Wishlist";
import { Suspense } from "react";

export default function WishlistPage() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <Wishlist />
    </Suspense>
  );
}
