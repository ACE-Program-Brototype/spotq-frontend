import { FINANCE_MESSAGES } from "@/features/finance/constants/finance.constants";
import type { DatePreset } from "@/features/finance/types/finance.types";

export function getTodayDateString() {
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 10);
}

export function getDateRange(preset: DatePreset, customStart: string, customEnd: string) {
  if (preset === "CUSTOM") {
    return {
      ...(customStart && { startDate: customStart }),
      ...(customEnd && { endDate: customEnd }),
    };
  }
  const end = new Date();
  const start = new Date();
  if (preset === "YESTERDAY") {
    start.setDate(start.getDate() - 1);
    end.setDate(end.getDate() - 1);
  } else if (preset === "LAST_7_DAYS") start.setDate(start.getDate() - 6);
  else if (preset === "LAST_30_DAYS") start.setDate(start.getDate() - 29);
  const format = (date: Date) => {
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
    return local.toISOString().slice(0, 10);
  };
  return { startDate: format(start), endDate: format(end) };
}

/**
 * Normalizes error messages from API calls, masking internal database crash leaks
 */
export function getErrorMessage(error: unknown, fallback: string = FINANCE_MESSAGES.ERROR): string {
  if (!error) return "";
  const raw =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : "";
  if (!raw) return fallback;

  // Mask database ORM / raw SQL crash messages leaked from development backend
  const isTechnicalDatabaseLeak =
    /prisma|queryraw|relation\s*["'].*["']\s*does not exist|syntax error|code:\s*['"]?[0-9a-z]+/i.test(
      raw,
    );

  if (isTechnicalDatabaseLeak) {
    return fallback;
  }
  return raw;
}
