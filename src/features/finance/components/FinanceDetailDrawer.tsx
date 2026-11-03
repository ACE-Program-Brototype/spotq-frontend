import { Dialog } from "@base-ui/react/dialog";
import { Check, Copy, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { LEDGER_ENTRY_TYPE } from "../constants/finance.constants";
import type { MasterLedgerEntry } from "../types/finance.types";
import { formatDate, formatPaise, typeLabels, typeStyles } from "../utils/finance-display.utils";

export function FinanceDetailDrawer({
  entry,
  copied,
  onCopy,
  onClose,
}: {
  entry: MasterLedgerEntry;
  copied: boolean;
  onCopy: () => void;
  onClose: () => void;
}) {
  const entryType = entry.type as keyof typeof typeLabels;
  const details = [
    {
      title: "Ledger details",
      values: [
        ["Restaurant ID", entry.restaurantId ?? undefined],
        ["Reference ID", entry.referenceId ?? undefined],
        ["Date & time", formatDate(entry.createdAt)],
      ],
    },
    { title: "Balance", values: [["Running balance", formatPaise(entry.runningBalancePaise)]] },
  ];

  return (
    <Dialog.Root open onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-40 bg-slate-950/30 backdrop-blur-[1px]" />
        <Dialog.Popup className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xl flex-col border-l border-slate-200 bg-white shadow-2xl outline-none">
          <div className="flex items-start justify-between border-b border-slate-200 p-5">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-indigo-600">
                Ledger entry
              </p>
              <Dialog.Title className="mt-1 text-lg font-bold text-slate-950">
                Transaction details
              </Dialog.Title>
              <p className="mt-1 font-mono text-xs text-slate-500">{entry.id}</p>
            </div>
            <Button variant="ghost" size="icon" aria-label="Close details" onClick={onClose}>
              <X className="size-5" />
            </Button>
          </div>
          <div className="flex-1 space-y-6 overflow-y-auto p-5">
            <div className="rounded-xl bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Transaction amount</span>
                <span
                  className={cn(
                    "font-mono text-xl font-bold tabular-nums",
                    entryType === LEDGER_ENTRY_TYPE.CUSTOMER_PAYMENT_INTAKE
                      ? "text-emerald-700"
                      : "text-slate-900",
                  )}
                >
                  {entryType === LEDGER_ENTRY_TYPE.CUSTOMER_PAYMENT_INTAKE ? "+" : "−"}
                  {formatPaise(entry.amountPaise)}
                </span>
              </div>
              <div className="mt-3 border-t border-slate-200 pt-3">
                <span
                  className={cn(
                    "rounded-full border px-2.5 py-1 text-[11px] font-semibold",
                    typeStyles[entryType] || "border-slate-200 bg-slate-50 text-slate-700",
                  )}
                >
                  {typeLabels[entryType] || entry.type}
                </span>
              </div>
            </div>
            {details.map((section) => (
              <DetailSection key={section.title} title={section.title}>
                {section.values.map(([label, value]) => (
                  <Detail key={label} label={label || ""} value={value} />
                ))}
              </DetailSection>
            ))}
          </div>
          <div className="flex flex-col gap-2 border-t border-slate-200 p-5 sm:flex-row">
            <Button variant="outline" className="flex-1" onClick={onCopy}>
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
              {copied ? "Copied" : "Copy transaction ID"}
            </Button>
            {entry.restaurantId && (
              <a
                href={`/admin/restaurants/${entry.restaurantId}`}
                className="inline-flex h-9 flex-1 items-center justify-center rounded-lg bg-indigo-600 px-3 text-sm font-medium text-white hover:bg-indigo-700"
              >
                View restaurant
              </a>
            )}
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">{title}</h3>
      <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 px-4">
        {children}
      </div>
    </section>
  );
}

function Detail({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <span className="text-xs text-slate-500">{label}</span>
      <span className="max-w-[60%] break-all text-right text-xs font-medium text-slate-900">
        {value || "Not provided"}
      </span>
    </div>
  );
}
