"use client";

import { Construction, CheckCircle2, Clock, Rocket, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

const OVERALL_PROGRESS = 40;
const CONTACT_URL = "https://atilimited.net/";

const MILESTONES = [
  { label: "Design Phase", percent: 100, done: true },
  { label: "Backend API",  percent: 35,  done: false },
  { label: "Frontend",     percent: 50,  done: false },
  { label: "Testing & QA", percent: 0,   done: false },
] as const;

export default function UnderDevelopment() {
  const t = useTranslations("UnderDevelopment");

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 md:p-12">
      <div className="w-full max-w-3xl">

        {/* Hero */}
        <div className="text-center mb-14">
          <div className="relative inline-flex mb-8">
            <span className="absolute inset-0 rounded-3xl bg-mauve-500 opacity-20 animate-ping" />
            <div className="relative w-24 h-24 rounded-3xl bg-linear-to-br from-mauve-700 to-mauve-900 flex items-center justify-center shadow-2xl shadow-mauve-800/40">
              <Construction size={44} className="text-white" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-800 tracking-tight mb-4">
            {t("title")}
          </h1>
          <p className="text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        {/* Progress card */}
        <Card className="mb-8 border-0 shadow-2xl shadow-mauve-800/10 rounded-3xl overflow-hidden">
          <div className="bg-linear-to-r from-mauve-900 to-mauve-600 px-8 py-5 flex items-center justify-between">
            <span className="text-white font-semibold text-lg">{t("progressTitle")}</span>
            <Badge className="bg-white/20 text-white border-none text-sm px-3">
              {OVERALL_PROGRESS}%
            </Badge>
          </div>
          <CardContent className="p-8">
            <div className="mb-8">
              <div className="flex justify-between text-sm mb-3">
                <span className="font-medium text-slate-600">{t("overall")}</span>
                <span className="font-bold text-mauve-800">{OVERALL_PROGRESS}%</span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-mauve-800 to-mauve-500 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${OVERALL_PROGRESS}%` }}
                />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {MILESTONES.map((m) => (
                <MilestoneItem key={m.label} label={m.label} percent={m.percent} done={m.done} />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Info cards */}
        <div className="grid md:grid-cols-2 gap-5 mb-10">
          <Card className="border border-slate-100 shadow-md rounded-2xl hover:shadow-lg transition-shadow">
            <CardContent className="p-6 flex items-start gap-4">
              <div className="p-3 rounded-xl bg-mauve-50 shrink-0">
                <Rocket size={22} className="text-mauve-800" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-1">{t("expectedTitle")}</h3>
                <p className="text-sm text-slate-500 mb-3">{t("expectedDesc")}</p>
                <Badge className="bg-mauve-800 text-white border-none">{t("comingSoon")}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-slate-100 shadow-md rounded-2xl hover:shadow-lg transition-shadow">
            <CardContent className="p-6 flex items-start gap-4">
              <div className="p-3 rounded-xl bg-amber-50 shrink-0">
                <Clock size={22} className="text-amber-500" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-1">{t("waitTitle")}</h3>
                <p className="text-sm text-slate-500">{t("waitDesc")}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="text-center">
          <p className="text-sm text-slate-400 mb-6 italic">{t("exploreMore")}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/">
              <Button
                variant="outline"
                className="border-slate-200 text-slate-700 hover:bg-slate-50 px-8 h-12 rounded-xl"
              >
                {t("returnHome")}
              </Button>
            </Link>
            <Link href={CONTACT_URL} target="_blank">
              <Button className="bg-mauve-800 hover:bg-mauve-700 text-white px-8 h-12 rounded-xl shadow-lg shadow-mauve-800/25 gap-2">
                {t("contactSupport")}
                <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

interface MilestoneItemProps {
  label: string;
  percent: number;
  done: boolean;
}

function MilestoneItem({ label, percent, done }: MilestoneItemProps) {
  return (
    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <CheckCircle2
            size={16}
            className={cn(done ? "text-emerald-500" : "text-slate-300")}
          />
          <span className="text-sm font-medium text-slate-700">{label}</span>
        </div>
        <span className={cn("text-xs font-bold", done ? "text-emerald-600" : "text-slate-400")}>
          {percent}%
        </span>
      </div>
      <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700",
            done ? "bg-emerald-400" : "bg-mauve-500",
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
