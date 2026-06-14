"use client";

//* SHARED LAYOUT SHELL FOR ALL ERROR PAGES — KEEPS EVERY ERROR PAGE VISUALLY CONSISTENT
//* GOAL: ONE PLACE TO CHANGE LAYOUT, SPACING, OR STRUCTURE ACROSS ALL ERROR PAGES
//* PATTERN: ACCEPT CONTENT AS PROPS → RENDER A SINGLE, REUSABLE PAGE STRUCTURE

import type { ReactNode } from "react";
import Link from "next/link";
import { type LucideIcon, MoveLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

//* EXPORTED SO CHILD ERROR COMPONENTS CAN EXTEND OR REFERENCE THIS TYPE DIRECTLY
export interface ActionButton {
  label: string;
  icon?: ReactNode;
  href?: string;   //* PROVIDE EITHER href (LINK) OR onClick (BUTTON) — NOT BOTH
  onClick?: () => void;
}

//* EXPORTED SO CONSUMERS CAN BUILD CUSTOM ERROR PAGES AGAINST THIS CONTRACT
export interface ErrorPageLayoutProps {
  icon: LucideIcon;
  iconBg: string;      //* TAILWIND BG CLASS — e.g. "bg-amber-50/50"
  iconColor: string;   //* TAILWIND TEXT CLASS — e.g. "text-amber-600"
  badge: string;       //* SHORT ERROR LABEL — e.g. "401 Error"
  badgeColor: string;  //* TAILWIND TEXT CLASS FOR THE BADGE COLOR
  title: string;
  description: ReactNode; //* ReactNode (NOT string) — ALLOWS CONDITIONAL/FORMATTED CONTENT
  primaryAction?: ActionButton;
  secondaryAction?: ActionButton;
}

//* PRIVATE SUB-COMPONENT — RENDERS ONE BUTTON CORRECTLY AS EITHER A LINK OR A CLICK HANDLER
//* EXTRACTED OUTSIDE THE PARENT SO IT IS NOT RECREATED ON EVERY RENDER OF ErrorPageLayout
function ErrorActionButton({
  action,
  variant,
}: {
  action: ActionButton;
  variant: "default" | "ghost";
}): ReactNode {
  const inner = (
    <span className="flex items-center gap-2">
      {action.icon}
      {action.label}
    </span>
  );

  //* USE Link WHEN href IS PROVIDED — ENABLES CLIENT-SIDE NAVIGATION WITHOUT FULL RELOAD
  if (action.href) {
    return (
      <Button asChild variant={variant}>
        <Link href={action.href}>{inner}</Link>
      </Button>
    );
  }

  //* FALL BACK TO A PLAIN BUTTON WHEN ONLY AN onClick HANDLER IS PROVIDED (E.G. RETRY, RELOAD)
  return (
    <Button variant={variant} onClick={action.onClick}>
      {inner}
    </Button>
  );
}

//* DEFAULT PRIMARY ACTION — OVERRIDDEN BY EACH SPECIFIC ERROR COMPONENT VIA PROPS
const DEFAULT_PRIMARY_ACTION: ActionButton = {
  label: "Back to Homepage",
  icon: <MoveLeft className="h-4 w-4" />,
  href: "/",
};

export function ErrorPageLayout({
  icon: Icon,
  iconBg,
  iconColor,
  badge,
  badgeColor,
  title,
  description,
  primaryAction = DEFAULT_PRIMARY_ACTION,
  secondaryAction,
}: ErrorPageLayoutProps): ReactNode {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">

        {/*//* ICON CONTAINER — COLOR CONVEYS SEVERITY (AMBER=WARNING, RED=DANGER, INDIGO=INFO) */}
        <div
          className={`mx-auto flex h-24 w-24 items-center justify-center rounded-full ${iconBg} mb-6`}
        >
          <Icon className={`h-12 w-12 ${iconColor}`} strokeWidth={1.5} />
        </div>

        {/*//* BADGE — MACHINE-READABLE ERROR CODE SHOWN TO THE USER IN A HUMAN-FRIENDLY WAY */}
        <p className={`text-sm font-semibold uppercase tracking-widest ${badgeColor}`}>
          {badge}
        </p>

        <h1 className="mt-4 text-3xl font-bold tracking-tight text-neutral-900 sm:text-5xl">
          {title}
        </h1>

        <p className="mt-6 text-base leading-7 text-neutral-600 max-w-md mx-auto">
          {description}
        </p>

        {/*//* ACTION BUTTONS — PRIMARY IS ALWAYS RENDERED; SECONDARY IS OPTIONAL */}
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <ErrorActionButton action={primaryAction} variant="default" />
          {secondaryAction && (
            <ErrorActionButton action={secondaryAction} variant="ghost" />
          )}
        </div>

      </div>
    </div>
  );
}
