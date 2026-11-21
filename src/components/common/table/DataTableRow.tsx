import { ChevronDown, ChevronRight } from "lucide-react";
import type React from "react";
import { Fragment } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils/cn";
import type { Column } from "./DataTable.types";

export interface DataTableRowProps<T> {
  row: T;
  rowIdx: number;
  rowId: string;
  columns: Column<T>[];
  totalColumnCount: number;
  isSelected: boolean;
  isExpanded: boolean;
  selectable?: boolean;
  renderExpandedRow?: (row: T, index: number) => React.ReactNode;
  onRowClick?: (
    row: T,
    event: React.MouseEvent<HTMLTableRowElement> | React.KeyboardEvent<HTMLTableRowElement>,
  ) => void;
  rowClassName?: string | ((row: T, index: number) => string);
  getRowTestId?: (row: T, index: number) => string;
  onRowSelect: (rowId: string, row: T, checked: boolean) => void;
  onToggleExpand: (rowId: string, row: T) => void;
  resolveColKey: (col: Column<T>, index: number) => string;
}

export function DataTableRow<T>({
  row,
  rowIdx,
  rowId,
  columns,
  totalColumnCount,
  isSelected,
  isExpanded,
  selectable,
  renderExpandedRow,
  onRowClick,
  rowClassName,
  getRowTestId,
  onRowSelect,
  onToggleExpand,
  resolveColKey,
}: DataTableRowProps<T>) {
  const computedRowClass =
    typeof rowClassName === "function" ? rowClassName(row, rowIdx) : rowClassName;

  return (
    <Fragment key={rowId}>
      <TableRow
        data-state={isSelected ? "selected" : undefined}
        aria-selected={selectable ? isSelected : undefined}
        tabIndex={onRowClick ? 0 : undefined}
        onClick={(e) => onRowClick?.(row, e)}
        onKeyDown={(e) => {
          if (onRowClick && (e.key === "Enter" || e.key === " ") && e.target === e.currentTarget) {
            e.preventDefault();
            onRowClick(row, e);
          }
        }}
        className={cn(
          onRowClick &&
            "cursor-pointer focus:outline-none focus-visible:bg-muted/60 focus-visible:ring-1 focus-visible:ring-ring",
          computedRowClass,
        )}
        data-testid={getRowTestId ? getRowTestId(row, rowIdx) : `data-table-row-${rowId}`}
      >
        {/* Expand Toggle Cell */}
        {renderExpandedRow && (
          <TableCell className="w-10 px-3 text-center">
            <button
              type="button"
              aria-expanded={isExpanded}
              onClick={(e) => {
                e.stopPropagation();
                onToggleExpand(rowId, row);
              }}
              className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
              aria-label={isExpanded ? "Collapse row" : "Expand row"}
            >
              {isExpanded ? (
                <ChevronDown className="size-4" />
              ) : (
                <ChevronRight className="size-4" />
              )}
            </button>
          </TableCell>
        )}

        {/* Selection Checkbox Cell */}
        {selectable && (
          <TableCell className="w-12 px-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-center">
              <Checkbox
                checked={isSelected}
                onCheckedChange={(checked) => onRowSelect(rowId, row, checked === true)}
                aria-label={`Select row ${rowIdx + 1}`}
                data-testid={`data-table-select-row-${rowId}`}
              />
            </div>
          </TableCell>
        )}

        {/* Dynamic Data Cells */}
        {columns.map((col, colIdx) => {
          const colKey = col.sortKey || resolveColKey(col, colIdx);

          let value: unknown;
          if (typeof col.accessor === "function") {
            value = col.accessor(row);
          } else if (col.accessor && typeof row === "object" && row !== null) {
            // biome-ignore lint/suspicious/noExplicitAny: dynamic accessor
            value = (row as any)[col.accessor];
          }

          let cellContent: React.ReactNode;
          if (col.cell) {
            cellContent = col.cell({ row, value, index: rowIdx });
          } else if (value instanceof Date) {
            cellContent = value.toLocaleDateString();
          } else if (typeof value === "boolean") {
            cellContent = value ? "Yes" : "No";
          } else {
            cellContent = value as React.ReactNode;
          }

          return (
            <TableCell
              key={colKey}
              className={cn(
                col.align === "right" && "text-right",
                col.align === "center" && "text-center",
                col.className,
              )}
            >
              {cellContent}
            </TableCell>
          );
        })}
      </TableRow>

      {/* Render Expanded Row */}
      {renderExpandedRow && isExpanded && (
        <TableRow className="bg-muted/30 hover:bg-muted/30">
          <TableCell colSpan={totalColumnCount} className="p-4">
            {renderExpandedRow(row, rowIdx)}
          </TableCell>
        </TableRow>
      )}
    </Fragment>
  );
}
