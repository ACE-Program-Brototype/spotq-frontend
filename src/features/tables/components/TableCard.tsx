import { LogOut, MoreVertical, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils/cn";
import { DOM_EVENTS, KEYBOARD_KEYS, TABLE_STATUS_CONFIG } from "../constants/table.constants";
import type { TableItem } from "../types/table.types";
import { TableStatusBadge } from "./TableStatusBadge";

interface TableCardProps {
  table: TableItem;
  onClick: (table: TableItem) => void;
  onRelease?: (table: TableItem) => void;
  className?: string;
}

export function TableCard({ table, onClick, onRelease, className }: TableCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const config = TABLE_STATUS_CONFIG[table.status] || TABLE_STATUS_CONFIG.AVAILABLE;

  // Format capacity or occupancy display
  const isOccupiedOrPartial = table.status === "OCCUPIED" || table.status === "PARTIAL_OCCUPIED";
  const canRelease = Boolean(onRelease && isOccupiedOrPartial && table.currentOccupancy > 0);

  const occupancyText = isOccupiedOrPartial
    ? `${table.currentOccupancy || 0}/${table.capacity}`
    : `${table.capacity} Seats`;

  useEffect(() => {
    if (!isMenuOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === KEYBOARD_KEYS.ESCAPE) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener(DOM_EVENTS.MOUSE_DOWN, handleClickOutside);
    document.addEventListener(DOM_EVENTS.KEY_DOWN, handleKeyDown);

    return () => {
      document.removeEventListener(DOM_EVENTS.MOUSE_DOWN, handleClickOutside);
      document.removeEventListener(DOM_EVENTS.KEY_DOWN, handleKeyDown);
    };
  }, [isMenuOpen]);

  return (
    <div
      className={cn(
        "group relative flex flex-col justify-between rounded-2xl border transition-all duration-200 select-none w-full min-w-0",
        "shadow-2xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-0",
        config.cardBgClass,
        config.cardBorderClass,
        config.topBorderClass,
        className,
      )}
    >
      <button
        type="button"
        onClick={() => onClick(table)}
        aria-label={`Table ${table.tableCode}, ${config.label}, ${occupancyText}`}
        className="flex flex-col justify-between p-3.5 sm:p-4 cursor-pointer text-left w-full min-w-0 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9a3412]"
      >
        {/* Top Row: Table Code + Status Badge */}
        <div className="flex items-center justify-between gap-1.5 mb-3 w-full min-w-0">
          <h3 className="text-xl sm:text-2xl font-black tracking-tight text-neutral-800 group-hover:text-neutral-950 transition-colors shrink-0">
            {table.tableCode}
          </h3>
          <TableStatusBadge status={table.status} size="sm" useShortLabel />
        </div>

        {/* Bottom Row: Capacity/Occupancy */}
        <div
          className={cn(
            "flex items-center text-xs font-semibold text-neutral-600 pt-1 w-full min-w-0",
            canRelease && "pr-8",
          )}
        >
          <div className="flex items-center gap-1.5 text-neutral-700 shrink-0">
            <Users className="size-3.5 sm:size-4 text-neutral-500 shrink-0" />
            <span>{occupancyText}</span>
          </div>
        </div>
      </button>

      {canRelease && (
        <div ref={menuRef} className="absolute right-2.5 bottom-2.5 z-20">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen((prev) => !prev);
            }}
            aria-label={`Actions for Table ${table.tableCode}`}
            aria-haspopup="menu"
            aria-expanded={isMenuOpen}
            data-testid={`table-actions-trigger-${table.id}`}
            className="flex size-7 items-center justify-center rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-[#eddcd4]/60 transition-colors cursor-pointer"
          >
            <MoreVertical className="size-4" />
          </button>

          {isMenuOpen && (
            <div
              role="menu"
              aria-label={`Actions menu for Table ${table.tableCode}`}
              data-testid={`table-actions-menu-${table.id}`}
              className="absolute right-0 bottom-full mb-1.5 z-30 min-w-36 rounded-xl bg-white p-1 border border-[#eddcd4] shadow-lg"
            >
              <button
                type="button"
                role="menuitem"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMenuOpen(false);
                  onRelease?.(table);
                }}
                data-testid={`release-table-action-${table.id}`}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-semibold text-[#9a3412] hover:bg-[#faf7f5] transition-colors cursor-pointer text-left"
              >
                <LogOut className="size-3.5 shrink-0" />
                <span>Release Table</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
