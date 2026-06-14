"use client";

//* RATE LIMIT ERROR PAGE — SHOWN WHEN THE API RETURNS 429 (TOO MANY REQUESTS)
//* GOAL: PREVENT THE USER FROM RETRYING IMMEDIATELY — ENFORCE A MANDATORY WAIT PERIOD
//* PATTERN: SINGLE setInterval ON MOUNT → DECREMENT EVERY SECOND → DERIVE canRetry FROM countdown

import { useEffect, useState } from "react";
import { type ReactNode } from "react";
import { Gauge, RotateCcw } from "lucide-react";
import { ErrorPageLayout } from "./ErrorPageLayout";

const COOLDOWN_SECONDS = 30;

export function RateLimitError(): ReactNode {
  const [countdown, setCountdown] = useState(COOLDOWN_SECONDS);

  //* DERIVED STATE — canRetry IS NOT INDEPENDENT; IT IS ALWAYS countdown <= 0
  //* REMOVING THE SEPARATE useState ELIMINATES THE CASCADING setState ERROR:
  //* "CALLING setState SYNCHRONOUSLY WITHIN AN EFFECT" WAS CAUSED BY UPDATING
  //* canRetry INSIDE AN EFFECT THAT ITSELF RAN BECAUSE countdown CHANGED
  const canRetry = countdown <= 0;

  useEffect(() => {
    //* SINGLE setInterval ON MOUNT — RUNS ONCE, NO CHAINED TIMEOUTS
    //* setTimeout CHAINING (PREVIOUS APPROACH) DRIFTS OVER TIME BECAUSE EACH
    //* CALLBACK SCHEDULES THE NEXT ONE AFTER JS EVENT LOOP PROCESSING DELAY
    const timer = setInterval(() => {
      setCountdown((prev) => {
        //* CLAMP AT 0 — PREVENTS NEGATIVE COUNTDOWN IF THE INTERVAL FIRES LATE
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    //* CLEANUP — CLEARS THE INTERVAL IF THE COMPONENT UNMOUNTS BEFORE COUNTDOWN ENDS
    return () => clearInterval(timer);
  }, []); //* EMPTY DEPS — INTERVAL IS REGISTERED ONCE ON MOUNT, NOT ON EVERY TICK

  const handleRetry = (): void => window.location.reload();

  const description = canRetry
    ? "You can now try again. Please continue with your request."
    : `You have sent too many requests in a short period. Please wait ${countdown} second${countdown !== 1 ? "s" : ""} before trying again.`;

  return (
    <ErrorPageLayout
      icon={Gauge}
      iconBg="bg-orange-50/50"
      iconColor="text-orange-600"
      badge="429 Error"
      badgeColor="text-orange-600"
      title="Too Many Requests"
      description={description}
      primaryAction={{
        label: canRetry ? "Try Again" : `Wait ${countdown}s...`,
        icon: <RotateCcw className="h-4 w-4" />,
        onClick: canRetry ? handleRetry : undefined,
      }}
    />
  );
}
