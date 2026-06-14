import { cn } from "@/lib/utils";

interface LogoIconProps {
  className?: string;
}

export default function LogoIcon({ className }: LogoIconProps) {
  return (
    <svg
      width="44"
      height="44"
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-11 h-11 shrink-0", className)}
      aria-label="Essence Lab"
    >
      <circle cx="22" cy="22" r="20" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.25" />
      <rect x="18" y="4" width="8" height="6" rx="1.5" fill="currentColor" />
      <rect x="16" y="9" width="12" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <rect x="9" y="16" width="26" height="24" rx="4" stroke="currentColor" strokeWidth="1.2" />
      <line x1="13" y1="27" x2="31" y2="27" stroke="currentColor" strokeWidth="0.6" strokeOpacity="0.35" />
    </svg>
  );
}
