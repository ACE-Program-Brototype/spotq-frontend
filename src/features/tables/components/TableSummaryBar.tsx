import { CheckCircle2, Clock, Users, Wrench } from "lucide-react";

interface TableSummaryBarProps {
  stats: {
    total: number;
    available: number;
    occupied: number;
    maintenance: number;
    totalCapacity: number;
    currentDiners: number;
  };
}

export function TableSummaryBar({ stats }: TableSummaryBarProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5">
      {/* Available */}
      <div className="flex items-center gap-2.5 sm:gap-3.5 p-3.5 sm:p-4 rounded-2xl border border-emerald-200/80 bg-emerald-50/40 shadow-2xs min-w-0">
        <div className="size-9 sm:size-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0 border border-emerald-200">
          <CheckCircle2 className="size-4.5 sm:size-5" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] sm:text-xs font-bold text-emerald-800 uppercase tracking-wider truncate">
            Available
          </p>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-xl sm:text-2xl font-black text-emerald-950">
              {stats.available}
            </span>
            <span className="text-xs text-emerald-700 whitespace-nowrap">
              / {stats.total} tables
            </span>
          </div>
        </div>
      </div>

      {/* Occupied */}
      <div className="flex items-center gap-2.5 sm:gap-3.5 p-3.5 sm:p-4 rounded-2xl border border-[#fed7aa] bg-[#ffedd5]/30 shadow-2xs min-w-0">
        <div className="size-9 sm:size-10 rounded-xl bg-[#fed7aa] flex items-center justify-center text-[#9a3412] shrink-0 border border-[#fbd0a7]">
          <Clock className="size-4.5 sm:size-5" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] sm:text-xs font-bold text-[#9a3412] uppercase tracking-wider truncate">
            Occupied
          </p>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-xl sm:text-2xl font-black text-[#7c2d12]">{stats.occupied}</span>
            <span className="text-xs text-neutral-600 whitespace-nowrap">tables seated</span>
          </div>
        </div>
      </div>

      {/* Maintenance */}
      <div className="flex items-center gap-2.5 sm:gap-3.5 p-3.5 sm:p-4 rounded-2xl border border-neutral-200 bg-neutral-50/70 shadow-2xs min-w-0">
        <div className="size-9 sm:size-10 rounded-xl bg-neutral-200 flex items-center justify-center text-neutral-700 shrink-0 border border-neutral-300">
          <Wrench className="size-4.5 sm:size-5" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] sm:text-xs font-bold text-neutral-600 uppercase tracking-wider truncate">
            Maintenance
          </p>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-xl sm:text-2xl font-black text-neutral-800">
              {stats.maintenance}
            </span>
            <span className="text-xs text-neutral-500 whitespace-nowrap">off rotation</span>
          </div>
        </div>
      </div>

      {/* Seating Capacity */}
      <div className="flex items-center gap-2.5 sm:gap-3.5 p-3.5 sm:p-4 rounded-2xl border border-[#eadfd8] bg-white shadow-2xs min-w-0">
        <div className="size-9 sm:size-10 rounded-xl bg-[#faf7f5] flex items-center justify-center text-[#9a3412] shrink-0 border border-[#eddcd4]">
          <Users className="size-4.5 sm:size-5" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] sm:text-xs font-bold text-neutral-600 uppercase tracking-wider truncate">
            Floor Capacity
          </p>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-xl sm:text-2xl font-black text-neutral-900">
              {stats.currentDiners}
            </span>
            <span className="text-xs text-neutral-500 whitespace-nowrap">
              / {stats.totalCapacity} seats
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
