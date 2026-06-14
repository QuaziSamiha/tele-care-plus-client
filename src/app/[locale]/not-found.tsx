// * ======== GLOBAL NOT FOUND PAGE =========
"use client";

import Link from "next/link";
import { MoveLeft, Leaf, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import "../../styles/globals.css";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        {/* Decorative Icon */}
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-blue-50/50 mb-6">
          <Search className="h-12 w-12 text-blue-600" strokeWidth={1.5} />
        </div>

        {/* Brand/Status Code */}
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
          404 Error
        </p>

        <h1 className="mt-4 text-3xl font-bold tracking-tight text-neutral-900 sm:text-5xl">
          Page Not Found
        </h1>

        <p className="mt-6 text-base leading-7 text-neutral-600 max-w-md mx-auto">
          We couldn&apos;t find the health product or page you&apos;re looking
          for. It might have been moved or the link has expired.
        </p>

        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button
            asChild
            variant="default"
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Link href="/en" className="flex items-center gap-2">
              <MoveLeft className="h-4 w-4" />
              Back to Homepage
            </Link>
          </Button>

          <Button asChild variant="ghost" className="text-neutral-600">
            <Link href="/products" className="flex items-center gap-2">
              <Leaf className="h-4 w-4" />
              Browse Products
            </Link>
          </Button>
        </div>
      </div>

      {/* Decorative Thai-inspired background element */}
      <div className="absolute -z-10 top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        {/* You can place a large blurred leaf or Thai pattern here */}
      </div>
    </div>
  );
}

/**
* Custom Not Found Page:
→ Next.js allows creating a custom not-found.js file.
→ This page is shown when a route does not exist.
→ Helps in improving user experience instead of showing a default error.
→ NotFound component doesn't except any props.
→ NotFound component can be created to specific folder for specific message or design.
*/
