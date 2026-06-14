"use client";

import { WifiOff, RotateCcw, MoveLeft } from "lucide-react";
import { ErrorPageLayout } from "./ErrorPageLayout";

export function NetworkError() {
  const handleRetry = () => window.location.reload();

  return (
    <ErrorPageLayout
      icon={WifiOff}
      iconBg="bg-slate-100/80"
      iconColor="text-slate-600"
      badge="Network Error"
      badgeColor="text-slate-600"
      title="Connection Failed"
      description="We could not reach the server. Please check your internet connection and try again. If the problem persists, the service may be temporarily unavailable."
      primaryAction={{
        label: "Retry",
        icon: <RotateCcw className="h-4 w-4" />,
        onClick: handleRetry,
      }}
      secondaryAction={{
        label: "Back to Homepage",
        icon: <MoveLeft className="h-4 w-4" />,
        href: "/",
      }}
    />
  );
}
