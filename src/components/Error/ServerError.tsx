"use client";

import { ServerCrash, RotateCcw, MoveLeft } from "lucide-react";
import { ErrorPageLayout } from "./ErrorPageLayout";

interface ServerErrorProps {
  /** Reset function from Next.js error.tsx — retries the failed render segment */
  reset?: () => void;
}

export function ServerError({ reset }: ServerErrorProps) {
  const handleAction = reset ?? (() => window.location.reload());

  return (
    <ErrorPageLayout
      icon={ServerCrash}
      iconBg="bg-rose-50/50"
      iconColor="text-rose-600"
      badge="500 Error"
      badgeColor="text-rose-600"
      title="Something Went Wrong"
      description="An unexpected error occurred on our end. Our team has been notified. Please try again — if the problem persists, contact support."
      primaryAction={{
        label: "Try Again",
        icon: <RotateCcw className="h-4 w-4" />,
        onClick: handleAction,
      }}
      secondaryAction={{
        label: "Back to Homepage",
        icon: <MoveLeft className="h-4 w-4" />,
        href: "/",
      }}
    />
  );
}
