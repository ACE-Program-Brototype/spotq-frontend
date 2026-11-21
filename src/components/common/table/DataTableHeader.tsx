import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils/cn";
import type { Column, SortDirection } from "./DataTable.types";

export interface DataTableHeaderProps<T> {
  columns: Column<T>[];
  selectable?: boolean;
  renderExpandedRow?: (row: T, index: number) => React.ReactNode;
  isAllSelected: boolean;
  isSomeSelected: boolean;
  onSelectAll: (checked: boolean) => void;
  activeSortBy?: string | null;
  activeSortOrder?: SortDirection | null;
  onSortClick: (col: Column<T>, index: number) => void;
  resolveColKey: (col: Column<T>, index: number) => string;
  sortIconColorClass: string;
  headerClassName?: string;
}

export function DataTableHeader<T>({
  columns,
  selectable,
  renderExpandedRow,
  isAllSelected,
  isSomeSelected,
  onSelectAll,
  activeSortBy,
  activeSortOrder,
  onSortClick,
  resolveColKey,
  sortIconColorClass,
  headerClassName,
}: DataTableHeaderProps<T>) {
  return (
    <TableHeader className={headerClassName}>
      <TableRow>
        {/* Expander Column Header */}
        {renderExpandedRow && (
          <TableHead className="w-10 px-3 text-center">
            <span className="sr-only">Expand</span>
          </TableHead>
        )}

        {/* Selection Column Header */}
        {selectable && (
          <TableHead className="w-12 px-4">
            <div className="flex items-center justify-center">
              <Checkbox
                checked={isAllSelected}
                indeterminate={isSomeSelected}
                onCheckedChange={() => {
                  onSelectAll(!isAllSelected);
                }}
                aria-label="Select all rows"
                data-testid="data-table-select-all"
              />
            </div>
          </TableHead>
        )}

        {/* Dynamic Column Headers */}
        {columns.map((col, colIdx) => {
          const colKey = col.sortKey || resolveColKey(col, colIdx);
          const isSorted = activeSortBy === colKey;
          const direction = isSorted ? activeSortOrder : null;

          const headerContent =
            typeof col.header === "function"
              ? col.header({ column: col, sortDirection: direction })
              : col.header;

          const alignClass =
            col.align === "right"
              ? "text-right justify-end"
              : col.align === "center"
                ? "text-center justify-center"
                : "text-left justify-start";

          return (
            <TableHead
              key={colKey}
              style={col.width ? { width: col.width } : undefined}
              className={cn(
                col.align === "right" && "text-right",
                col.align === "center" && "text-center",
                col.headerClassName,
              )}
              aria-sort={
                col.sortable
                  ? direction === "asc"
                    ? "ascending"
                    : direction === "desc"
                      ? "descending"
                      : "none"
                  : undefined
              }
            >
              {col.sortable ? (
                <button
                  type="button"
                  onClick={() => onSortClick(col, colIdx)}
                  className={cn(
                    "inline-flex items-center gap-1.5 font-bold uppercase transition-colors group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-sm px-1 -mx-1",
                    alignClass,
                    isSorted ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                  aria-label={`Sort by ${typeof col.header === "string" ? col.header : colKey}`}
                >
                  <span>{headerContent}</span>
                  {direction === "asc" ? (
                    <ArrowUp className={cn("size-3.5 stroke-[2.5]", sortIconColorClass)} />
                  ) : direction === "desc" ? (
                    <ArrowDown className={cn("size-3.5 stroke-[2.5]", sortIconColorClass)} />
                  ) : (
                    <ArrowUpDown className="size-3 text-muted-foreground/60 group-hover:text-muted-foreground transition-colors" />
                  )}
                </button>
              ) : (
                <div className={cn("inline-flex items-center font-bold uppercase", alignClass)}>
                  {headerContent}
                </div>
              )}
            </TableHead>
          );
        })}
      </TableRow>
    </TableHeader>
  );
}
