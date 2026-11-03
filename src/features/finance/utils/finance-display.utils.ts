import type { LedgerEntryType } from "../types/finance.types";

export const typeLabels: Record<LedgerEntryType, string> = {
  CUSTOMER_PAYMENT_INTAKE: "Customer inflow",
  SETTLEMENT_DISBURSED: "EOD settlement",
  REFUND_EXPENSE: "Refund outflow",
};

export const typeStyles: Record<LedgerEntryType, string> = {
  CUSTOMER_PAYMENT_INTAKE: "border-emerald-200 bg-emerald-50 text-emerald-700",
  SETTLEMENT_DISBURSED: "border-purple-200 bg-purple-50 text-purple-700",
  REFUND_EXPENSE: "border-rose-200 bg-rose-50 text-rose-700",
};

export function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }).format(date);
}

export function formatPaise(value: string | undefined, currency = "INR") {
  if (!value || !/^-?\d+$/.test(value)) return undefined;

  try {
    const amount = BigInt(value);
    const absoluteAmount = amount < 0n ? -amount : amount;
    const wholeUnits = absoluteAmount / 100n;
    const minorUnits = String(absoluteAmount % 100n).padStart(2, "0");
    const formatter = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    const signedWholeUnits = amount < 0n ? -wholeUnits : wholeUnits;
    const parts = formatter.formatToParts(
      amount < 0n && wholeUnits === 0n ? -1n : signedWholeUnits,
    );
    let replacedInteger = false;

    return parts
      .map((part) => {
        if (part.type === "integer" || part.type === "group") {
          if (replacedInteger) return "";
          replacedInteger = true;
          return new Intl.NumberFormat("en-IN", { useGrouping: true }).format(wholeUnits);
        }
        if (part.type === "fraction") return minorUnits;
        return part.value;
      })
      .join("");
  } catch {
    return undefined;
  }
}
