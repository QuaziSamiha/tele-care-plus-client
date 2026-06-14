"use client";
// * =========== GLOBAL LOADING PAGE ===========
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingPageProps {
  message?: string;
  className?: string;
  fullPage?: boolean;
}

const LoadingPage = ({
  message = "Loading Essence Labs...",
  className,
  fullPage = true,
}: LoadingPageProps) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center transition-all duration-300",
        fullPage
          ? "fixed inset-0 z-[9999] bg-background/80 backdrop-blur-sm"
          : "h-full w-full min-h-50",
        className,
      )}
    >
      <div className="relative flex items-center justify-center">
        {/* Animated Outer Ring */}
        <div className="absolute h-16 w-16 animate-pulse rounded-full border-4 border-mauve-700/20" />

        {/* Spinning Icon */}
        <Loader2
          className="h-10 w-10 animate-spin text-mauve-700"
          strokeWidth={2}
        />
      </div>

      {message && (
        <p className="mt-4 animate-pulse text-sm font-medium text-neutral-600 tracking-wide">
          {message}
        </p>
      )}
    </div>
  );
};

export default LoadingPage;

/**
 * standalone, reusable component that can be used in two ways:
 * As a full-page overlay (for initial app loading).
 * As a localized container loader (for specific sections).
 * Fixed vs. Inline: The fullPage prop allows you to use this for the entire screen (blocking interaction)
 * or inside a specific div (like a product list loading).
 */
