"use client";

import { useSearchParams } from "next/navigation";
import { ShieldAlert, LogIn, MoveLeft } from "lucide-react";
import { ErrorPageLayout } from "./ErrorPageLayout";

export function Unauthorized() {
  const searchParams = useSearchParams();
  const from = searchParams.get("from");

  //* ONLY APPEND callbackUrl WHEN from IS A REAL PROTECTED PATH, NOT THE DEFAULT "/"
  //* WITHOUT THIS CHECK: /unauthorized (no ?from param) → from defaults to "/" →
  //* href BECOMES /signin?callbackUrl=%2F — THE %2F IS JUST AN ENCODED "/" WHICH IS MEANINGLESS
  const signInHref = from && from !== "/"
    ? `/signin?callbackUrl=${encodeURIComponent(from)}`
    : "/signin";

  return (
    <ErrorPageLayout
      icon={ShieldAlert}
      iconBg="bg-amber-50/50"
      iconColor="text-amber-600"
      badge="401 Error"
      badgeColor="text-amber-600"
      title="Authentication Required"
      description="You need to be signed in to access this page. Please log in to continue, or return to the homepage."
      primaryAction={{
        label: "Sign In",
        icon: <LogIn className="h-4 w-4" />,
        href: signInHref,
      }}
      secondaryAction={{
        label: "Back to Homepage",
        icon: <MoveLeft className="h-4 w-4" />,
        href: "/",
      }}
    />
  );
}
