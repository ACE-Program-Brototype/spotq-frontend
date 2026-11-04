import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

export function FinanceMetricCard({
  title,
  value,
  caption,
  icon: Icon,
  accent,
  loading,
}: {
  title: string;
  value?: string;
  caption: string;
  icon: LucideIcon;
  accent: string;
  loading: boolean;
}) {
  return (
    <Card className="border-slate-200/80 shadow-xs">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
            {title}
          </p>
          <span
            className={cn("flex size-9 shrink-0 items-center justify-center rounded-xl", accent)}
          >
            <Icon className="size-4" />
          </span>
        </div>
        {loading ? (
          <div className="mt-3 h-8 w-36 animate-pulse rounded-md bg-slate-100" />
        ) : (
          <p className="mt-3 font-mono text-2xl font-bold tabular-nums tracking-tight text-slate-950">
            {value ?? "—"}
          </p>
        )}
        <p className="mt-2 text-xs text-slate-500">{caption}</p>
      </CardContent>
    </Card>
  );
}
