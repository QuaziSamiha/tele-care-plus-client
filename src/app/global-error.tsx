"use client";

import { useEffect } from "react";
import { ServerCrash, RotateCcw, MoveLeft } from "lucide-react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Root-level error boundary — catches errors thrown inside the root layout itself.
 * Must render its own <html> and <body> since it replaces the entire document tree.
 * Keep dependencies minimal: no providers, no shared components that might also crash.
 */
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("[Global Error]", error.digest, error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div
          style={{
            display: "flex",
            minHeight: "100vh",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "4rem 1.5rem",
            fontFamily: "system-ui, sans-serif",
            backgroundColor: "#fff",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              height: 96,
              width: 96,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              backgroundColor: "#fff1f2",
              marginBottom: 24,
            }}
          >
            <ServerCrash
              style={{ height: 48, width: 48, color: "#e11d48" }}
              strokeWidth={1.5}
            />
          </div>

          <p
            style={{
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#e11d48",
            }}
          >
            Critical Error
          </p>

          <h1
            style={{
              marginTop: 16,
              fontSize: "clamp(1.5rem, 4vw, 3rem)",
              fontWeight: 700,
              color: "#171717",
            }}
          >
            Application Failed to Load
          </h1>

          <p style={{ marginTop: 24, color: "#525252", maxWidth: 400 }}>
            A critical error prevented the application from loading. Our team
            has been notified. Please try refreshing the page.
          </p>

          <div
            style={{
              marginTop: 40,
              display: "flex",
              gap: 16,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <button
              onClick={reset}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 20px",
                backgroundColor: "#171717",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              <RotateCcw style={{ height: 16, width: 16 }} />
              Try Again
            </button>
            <a
              href="/"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 20px",
                color: "#525252",
                border: "none",
                background: "none",
                cursor: "pointer",
                fontWeight: 500,
                textDecoration: "none",
              }}
            >
              <MoveLeft style={{ height: 16, width: 16 }} />
              Go to Homepage
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
