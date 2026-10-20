import { cn } from "@/lib/utils/cn";
import type { TablesGroupedBySection } from "../types/table.types";

interface TableSectionTabsProps {
  sections: string[];
  activeSection: string;
  onSelectSection: (section: string) => void;
  tablesBySection?: TablesGroupedBySection;
  className?: string;
}

export function TableSectionTabs({
  sections,
  activeSection,
  onSelectSection,
  tablesBySection = {},
  className,
}: TableSectionTabsProps) {
  if (sections.length === 0) return null;

  return (
    <div
      className={cn(
        "flex items-center gap-6 sm:gap-8 border-b border-[#eddcd4] overflow-x-auto scrollbar-none",
        className,
      )}
      role="tablist"
      aria-label="Dining Sections"
    >
      {sections.map((section) => {
        const isActive = activeSection === section;
        const count = tablesBySection[section]?.length;

        return (
          <button
            key={section}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelectSection(section)}
            className={cn(
              "relative pb-3 text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2",
              isActive ? "text-[#9a3412]" : "text-neutral-500 hover:text-neutral-900",
            )}
          >
            <span>{section}</span>
            {typeof count === "number" && (
              <span
                className={cn(
                  "px-2 py-0.5 text-xs font-bold rounded-full transition-colors",
                  isActive ? "bg-[#fed7aa]/60 text-[#9a3412]" : "bg-neutral-100 text-neutral-600",
                )}
              >
                {count}
              </span>
            )}
            {isActive && (
              <span
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#9a3412] rounded-t-full"
                aria-hidden="true"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
