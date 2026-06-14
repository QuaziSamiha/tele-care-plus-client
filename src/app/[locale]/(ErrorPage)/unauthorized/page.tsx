import { Suspense } from "react";
import { Unauthorized } from "@/components/Error";

export const metadata = { title: "401 — Authentication Required" };

// Unauthorized uses useSearchParams, which requires Suspense boundary
export default function UnauthorizedPage() {
  return (
    <Suspense>
      <Unauthorized />
    </Suspense>
  );
}
