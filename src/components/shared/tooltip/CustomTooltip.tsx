"use client";

import { BiSolidEdit } from "react-icons/bi";
import { IoEyeOutline } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// 1. Move configuration outside the component to prevent re-creation
const ACTION_CONFIG = {
  edit: {
    Icon: BiSolidEdit,
    iconClass: "text-neutralPrimary-500 hover:text-blue-600",
    size: 24,
  },
  view: {
    Icon: IoEyeOutline,
    iconClass: "text-neutralPrimary-500 hover:text-green-600",
    size: 20,
  },
  delete: {
    Icon: MdDelete,
    iconClass: "text-neutralPrimary-500 hover:text-red-600",
    size: 24,
  },
} as const;

type TooltipAction = keyof typeof ACTION_CONFIG;

interface ICustomTooltip {
  action: TooltipAction;
  content: string;
  onClick?: () => void;
  className?: string;
}

export default function CustomTooltip({ action, content, onClick, className }: ICustomTooltip) {
  const config = ACTION_CONFIG[action];
  const { Icon, iconClass, size } = config;

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          {/* 2. Using a button for better accessibility and event handling */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation(); // 3. Important for use inside clickable table rows
              onClick?.();
            }}
            className={`p-1 transition-all active:scale-95 cursor-pointer focus-visible:outline-none ${className}`}
            aria-label={content}
          >
            <Icon size={size} className={iconClass} />
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="bg-neutral-800 text-white border-none">
          <p className="text-xs font-medium">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}