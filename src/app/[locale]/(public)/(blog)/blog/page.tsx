
import LoadingPage from "@/components/shared/loading/LoadingPage";
import Blog from "@/modules/blog/public/blog/Blog";
import { Suspense } from "react";

export default function BlogPage() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <Blog />
    </Suspense>
  );
}
