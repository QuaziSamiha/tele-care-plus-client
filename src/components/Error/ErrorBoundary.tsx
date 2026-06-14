"use client";

//* SECTION-LEVEL ERROR BOUNDARY — ISOLATES RENDER FAILURES TO A SINGLE SUBTREE
//* GOAL: ONE CRASHING WIDGET MUST NOT TAKE DOWN THE ENTIRE PAGE
//* PATTERN: WRAP ANY RISKY SUBTREE → ON THROW, SHOW FALLBACK → ALLOW RETRY WITHOUT FULL RELOAD
//* NOTE: MUST BE A CLASS COMPONENT — React DOES NOT SUPPORT ERROR BOUNDARIES AS FUNCTION COMPONENTS

import { Component, type ReactNode, type ErrorInfo } from "react";
import { ServerCrash, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

//* RENDER PROP PATTERN FOR fallback ALLOWS THE PARENT TO ACCESS error AND reset
//* onError HOOK LETS THE PARENT WIRE UP AN EXTERNAL MONITORING SERVICE (SENTRY, DATADOG, ETC.)
export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
  onError?: (error: Error, info: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

//* NAMED INTERFACE KEEPS DefaultErrorFallback PROPS EXPLICIT AND SEPARATELY DOCUMENTABLE
interface DefaultErrorFallbackProps {
  error: Error;     //* ALWAYS NON-NULL WHEN THIS COMPONENT IS RENDERED — hasError GUARANTEES IT
  reset: () => void;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  //* CLASS FIELD INITIALIZATION — REMOVES THE NEED FOR A CONSTRUCTOR ENTIRELY
  state: ErrorBoundaryState = { hasError: false, error: null };

  //* STATIC LIFECYCLE — CALLED BY React DURING RENDER TO DERIVE STATE FROM THE THROWN ERROR
  //* MUST BE STATIC: React CALLS THIS BEFORE THE INSTANCE IS AVAILABLE
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  //* CALLED AFTER THE ERROR IS CAUGHT AND THE FALLBACK UI IS COMMITTED TO THE DOM
  //* THIS IS THE CORRECT PLACE FOR SIDE EFFECTS (LOGGING, MONITORING) — NOT getDerivedStateFromError
  componentDidCatch(error: Error, info: ErrorInfo): void {
    //* CALL THE PARENT-PROVIDED MONITORING HOOK FIRST (SENTRY, DATADOG, CUSTOM LOGGER)
    this.props.onError?.(error, info);

    //* LOG TO CONSOLE ONLY IN DEVELOPMENT — NEVER FLOOD PRODUCTION LOGS WITH CAUGHT UI ERRORS
    if (process.env.NODE_ENV === "development") {
      console.error("[ErrorBoundary]", error.message, info.componentStack);
    }
  }

  //* CLASS FIELD ARROW FUNCTION — AUTOMATICALLY BOUND TO THE INSTANCE
  //* AVOIDS this.reset.bind(this) IN CONSTRUCTOR AND PREVENTS STALE REFERENCE BUGS
  reset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    const { hasError, error } = this.state;
    const { children, fallback } = this.props;

    //* HAPPY PATH — RENDER CHILDREN NORMALLY WHEN NO ERROR HAS OCCURRED
    if (!hasError) return children;

    //* CUSTOM FALLBACK — CALLER CONTROLS THE UI AND RECEIVES error + reset FOR FULL FLEXIBILITY
    if (fallback) return fallback(error!, this.reset);

    //* DEFAULT FALLBACK — USED WHEN NO CUSTOM fallback PROP IS PROVIDED
    //* error! IS SAFE HERE: hasError === true GUARANTEES error IS NEVER null AT THIS POINT
    return <DefaultErrorFallback error={error!} reset={this.reset} />;
  }
}

//* PRIVATE DEFAULT FALLBACK — NOT EXPORTED; USE THE fallback PROP FOR CUSTOM UI
//* INTENTIONALLY MINIMAL: SHOWS WHAT BROKE AND OFFERS A SINGLE RETRY ACTION
function DefaultErrorFallback({ error, reset }: DefaultErrorFallbackProps): ReactNode {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-red-100 bg-red-50/30 p-8 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
        <ServerCrash className="h-7 w-7 text-red-500" strokeWidth={1.5} />
      </div>
      <div>
        <p className="font-semibold text-neutral-800">Something went wrong</p>
        <p className="mt-1 text-sm text-neutral-500">
          {error.message || "An unexpected error occurred in this section."}
        </p>
      </div>
      <Button variant="outline" size="sm" onClick={reset} className="gap-2">
        <RotateCcw className="h-3.5 w-3.5" />
        Try again
      </Button>
    </div>
  );
}
