"use client";

import { Wrench, RotateCcw } from "lucide-react";
import { ErrorPageLayout } from "./ErrorPageLayout";

export function MaintenanceError() {
  const handleRetry = () => window.location.reload();

  return (
    <ErrorPageLayout
      icon={Wrench}
      iconBg="bg-indigo-50/50"
      iconColor="text-indigo-600"
      badge="503 — Maintenance"
      badgeColor="text-indigo-600"
      title="Under Maintenance"
      description="We are currently performing scheduled maintenance to improve your experience. We will be back shortly. Thank you for your patience."
      primaryAction={{
        label: "Check Again",
        icon: <RotateCcw className="h-4 w-4" />,
        onClick: handleRetry,
      }}
    />
  );
}
