import { CalendarDays, Search } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { Input } from "@/components/ui/input";
import type { DatePreset } from "../types/finance.types";

export interface LedgerFilterState {
  search: string;
  type: string;
  datePreset: DatePreset;
  customStart: string;
  customEnd: string;
  page: number;
}

export interface LedgerFiltersProps {
  search: string;
  type: string;
  datePreset: DatePreset;
  customStart: string;
  customEnd: string;
  setFilters: Dispatch<SetStateAction<LedgerFilterState>>;
}

export function LedgerFilters({
  search,
  type,
  datePreset,
  customStart,
  customEnd,
  setFilters,
}: LedgerFiltersProps) {
  return (
    <div className="grid w-full min-w-0 grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
      <div className="relative min-w-0 sm:col-span-2 lg:col-span-3 2xl:col-span-1">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
        <Input
          value={search}
          onChange={(event) =>
            setFilters((state) => ({ ...state, search: event.target.value, page: 1 }))
          }
          placeholder="Order ID, Razorpay ID, restaurant…"
          className="min-w-0 pl-9"
          aria-label="Search ledger"
        />
      </div>
      <select
        aria-label="Transaction type"
        value={type}
        onChange={(event) =>
          setFilters((state) => ({ ...state, type: event.target.value, page: 1 }))
        }
        className="h-9 min-w-0 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-indigo-400"
      >
        <option value="ALL">All transaction types</option>
        <option value="CUSTOMER_PAYMENT_INTAKE">Customer inflows</option>
        <option value="SETTLEMENT_DISBURSED">EOD settlements</option>
        <option value="REFUND_EXPENSE">Refunds</option>
      </select>
      <label className="relative min-w-0">
        <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
        <select
          aria-label="Date range"
          value={datePreset}
          onChange={(event) =>
            setFilters((state) => ({
              ...state,
              datePreset: event.target.value as DatePreset,
              page: 1,
            }))
          }
          className="h-9 w-full min-w-0 rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-700 outline-none focus:border-indigo-400"
        >
          <option value="TODAY">Today</option>
          <option value="YESTERDAY">Yesterday</option>
          <option value="LAST_7_DAYS">Last 7 days</option>
          <option value="LAST_30_DAYS">Last 30 days</option>
          <option value="CUSTOM">Custom range</option>
        </select>
      </label>
      {datePreset === "CUSTOM" && (
        <div className="col-span-1 flex min-w-0 flex-wrap gap-2 sm:col-span-2 lg:col-span-3 2xl:col-span-2">
          <Input
            aria-label="Start date"
            type="date"
            value={customStart}
            onChange={(event) =>
              setFilters((state) => ({ ...state, customStart: event.target.value, page: 1 }))
            }
            className="w-max"
          />
          <Input
            aria-label="End date"
            type="date"
            value={customEnd}
            onChange={(event) =>
              setFilters((state) => ({ ...state, customEnd: event.target.value, page: 1 }))
            }
            className="w-max"
          />
        </div>
      )}
    </div>
  );
}
