"use client";

import { useEffect } from "react";
import { ServerError } from "@/components/Error";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Next.js segment-level error boundary.
 * Catches runtime errors thrown in any page under [locale].
 * The `reset` function re-renders the failed segment without a full reload.
 */
export default function LocaleError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Forward to your monitoring service in production
    console.error("[Segment Error]", error.digest, error);
  }, [error]);

  return <ServerError reset={reset} />;
}
