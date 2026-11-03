import { Download, Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FinancePageHeader({
  exporting,
  onExport,
}: {
  exporting: boolean;
  onExport: () => void;
}) {
  return (
    <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <div className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
            <Landmark className="size-4" />
          </span>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-700">
            Platform finance
          </p>
        </div>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
          Finance Overview &amp; Master Ledger
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Monitor platform turnover, EOD settlement queue, and the global accounting ledger.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          onClick={onExport}
          disabled={exporting}
          className="bg-indigo-600 text-white hover:bg-indigo-700"
        >
          <Download className="size-4" /> {exporting ? "Exporting…" : "Export CSV"}
        </Button>
      </div>
    </header>
  );
}
