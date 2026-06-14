"use client";

import { ShieldX, MoveLeft } from "lucide-react";
import { ErrorPageLayout } from "./ErrorPageLayout";

export function Forbidden() {
  return (
    <ErrorPageLayout
      icon={ShieldX}
      iconBg="bg-red-50/50"
      iconColor="text-red-600"
      badge="403 Error"
      badgeColor="text-red-600"
      title="Access Forbidden"
      description="You are signed in, but your account does not have permission to view this page. Contact your administrator if you believe this is a mistake."
      primaryAction={{
        label: "Back to Homepage",
        icon: <MoveLeft className="h-4 w-4" />,
        href: "/",
      }}
    />
  );
}
