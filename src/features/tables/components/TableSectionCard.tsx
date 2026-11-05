import { Layers, Trash2 } from "lucide-react";
import type { TableSectionAll } from "../types/table.types";

interface TableSectionCardProps {
  section: TableSectionAll;
  onUnlist: (section: TableSectionAll) => void;
}

export function TableSectionCard({ section, onUnlist }: TableSectionCardProps) {
  return (
    <article
      className="group relative flex flex-col justify-between rounded-2xl border border-[#ede4de] bg-white p-5 shadow-[0_2px_8px_rgba(65,44,31,.03)] transition-all duration-200 hover:border-[#dfd3cb] hover:shadow-[0_4px_16px_rgba(65,44,31,.06)]"
      data-testid={`section-card-${section.id}`}
    >
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#f8f3ef] text-[#9a3412] transition-colors group-hover:bg-[#faeae1]">
            <Layers className="size-5" />
          </div>
        </div>

        <h3
          className="mt-4 text-base font-bold tracking-tight text-[#252a26] transition-colors group-hover:text-[#9a3412]"
          title={section.name}
        >
          {section.name}
        </h3>
      </div>

      <div className="mt-5 flex items-center justify-end border-t border-[#f4ede8] pt-3.5">
        <button
          type="button"
          onClick={() => onUnlist(section)}
          aria-label={`Unlist section ${section.name}`}
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[#8b3b1d] transition-colors hover:bg-red-50 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
        >
          <Trash2 className="size-3.5" />
          Unlist
        </button>
      </div>
    </article>
  );
}
