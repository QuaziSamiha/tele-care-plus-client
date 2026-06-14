"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Construction, Sparkles, Clock, BellRing } from "lucide-react";
import { useTranslations } from "next-intl";

const PROGRESS_VALUE = 40;
const ESTIMATED_LAUNCH = "Q3 2026";

interface UnderDevelopmentModalProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
}

export default function UnderDevelopmentModal({
  isOpen,
  onClose,
}: UnderDevelopmentModalProps) {
  const t = useTranslations("UnderDevModals");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md border-none shadow-2xl p-0 overflow-hidden rounded-3xl">

        {/* Gradient header — no external CDN dependency */}
        <div className="relative h-36 bg-linear-to-br from-mauve-900 via-mauve-700 to-mauve-500 flex items-center justify-center overflow-hidden">
          {/* Pure-CSS decorative circles */}
          <div className="absolute top-3 left-6 w-20 h-20 rounded-full bg-white/10" />
          <div className="absolute -bottom-4 right-10 w-28 h-28 rounded-full bg-white/10" />
          <div className="absolute top-6 right-8 w-10 h-10 rounded-full bg-white/10" />

          {/* Icon */}
          <div className="relative bg-white/15 backdrop-blur-sm p-4 rounded-2xl border border-white/25 z-10">
            <Construction className="w-10 h-10 text-white" />
          </div>

          <Sparkles className="absolute top-4 right-5 text-white/60 w-5 h-5 animate-pulse" />
          <Sparkles className="absolute bottom-5 left-7 text-white/40 w-4 h-4 animate-pulse delay-300" />
        </div>

        <div className="p-6 pt-7">
          <DialogHeader className="text-center sm:text-center mb-6">
            <DialogTitle className="text-2xl font-bold text-slate-800">
              {t("underDevTitle")}
            </DialogTitle>
            <DialogDescription className="text-slate-500 pt-1.5 leading-relaxed">
              {t("underDevSubtitle")}
            </DialogDescription>
          </DialogHeader>

          {/* Progress */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-mauve-700 uppercase tracking-widest">
                {t("progressLabel")}
              </span>
              <Badge
                variant="secondary"
                className="bg-mauve-50 text-mauve-700 border-none font-bold"
              >
                {PROGRESS_VALUE}%
              </Badge>
            </div>
            <Progress value={PROGRESS_VALUE} className="h-2 bg-slate-100" />
          </div>

          {/* Launch estimate */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-4 mb-7">
            <div className="bg-white p-2.5 rounded-xl shadow-sm shrink-0">
              <Clock className="w-5 h-5 text-slate-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-400 font-medium">{t("estimatedTime")}</p>
              <p className="text-sm font-bold text-slate-700">{ESTIMATED_LAUNCH}</p>
            </div>
            <Badge className="bg-slate-800 text-white border-none shrink-0">
              {t("comingSoon")}
            </Badge>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={() => onClose(false)}
              className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 h-12"
            >
              {t("close")}
            </Button>
            <Button
              onClick={() => onClose(false)}
              className="rounded-xl bg-mauve-800 hover:bg-mauve-700 text-white shadow-lg shadow-mauve-800/20 h-12 gap-2"
            >
              <BellRing className="w-4 h-4" />
              {t("notifyMe")}
            </Button>
          </div>
        </div>

      </DialogContent>
    </Dialog>
  );
}
