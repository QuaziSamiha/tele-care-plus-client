import LoadingPage from "@/components/shared/loading/LoadingPage";
import BlogDetails from "@/modules/blog/public/blogDetails/BlogDetails";
import { Suspense } from "react";

export default function BlogDetailsPage() {
  return (
    // Suspense handles the loading state if ProductDetails
    // is doing any asynchronous work or if you want
    // a clean wrapper around the client-side data fetch.
    <Suspense fallback={<LoadingPage />}>
      <BlogDetails />
    </Suspense>
  );
}
