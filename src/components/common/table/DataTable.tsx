import { ArrowDown, ArrowUp, ArrowUpDown, ChevronDown, ChevronRight } from "lucide-react";
import type React from "react";
import { Fragment, useCallback, useId, useMemo, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils/cn";
import type { Column, DataTableProps, SortDirection } from "./DataTable.types";
import { DataTableEmptyState } from "./DataTableEmptyState";
import { DataTablePagination } from "./DataTablePagination";
import { DataTableSkeleton } from "./DataTableSkeleton";

export function DataTable<T>({
  data,
  columns,
  getRowId,
  getRowTestId,
  isLoading = false,
  loadingRowCount = 5,
  loadingRenderer,
  error = null,
  emptyState,
  emptyTitle,
  emptyDescription,
  emptyAction,
  sortBy: controlledSortBy,
  sortOrder: controlledSortOrder,
  onSort,
  defaultSortBy,
  defaultSortOrder = "asc",
  onRowClick,
  rowClassName,
  selectable = false,
  selectedRowKeys,
  onSelectionChange,
  renderExpandedRow,
  expandedRowKeys: controlledExpandedRowKeys,
  onToggleExpandRow,
  pagination,
  caption,
  theme = "admin",
  className,
  containerClassName,
  tableClassName,
  headerClassName,
  bodyClassName,
  "aria-label": ariaLabel = "Data Table",
  testId = "data-table",
}: DataTableProps<T>) {
  const instanceId = useId();

  // Internal client-side sort state (used when onSort is not provided)
  const [internalSortBy, setInternalSortBy] = useState<string | null>(defaultSortBy || null);
  const [internalSortOrder, setInternalSortOrder] = useState<SortDirection>(defaultSortOrder);

  // Uncontrolled selection state
  const [internalSelectedKeys, setInternalSelectedKeys] = useState<Set<string>>(new Set());

  // Uncontrolled expansion state
  const [internalExpandedKeys, setInternalExpandedKeys] = useState<Set<string>>(new Set());

  // Determine active sort state
  const isServerSort = typeof onSort === "function";
  const activeSortBy = isServerSort ? controlledSortBy : internalSortBy;
  const activeSortOrder = isServerSort ? controlledSortOrder : internalSortOrder;

  // Resolve row unique identifier
  const resolveRowId = useCallback(
    (row: T, index: number): string => {
      if (getRowId) return getRowId(row, index);
      if (row && typeof row === "object" && "id" in row && row.id !== undefined) {
        return String(row.id);
      }
      return `${instanceId}-row-${index}`;
    },
    [getRowId, instanceId],
  );

  // Resolve Column key
  const resolveColKey = useCallback((col: Column<T>, index: number): string => {
    if (col.key) return col.key;
    if (col.id) return col.id;
    if (typeof col.accessor === "string") return col.accessor;
    return `col-${index}`;
  }, []);

  // Sort click handler
  const handleSortClick = (col: Column<T>, index: number) => {
    if (!col.sortable) return;
    const colKey = col.sortKey || resolveColKey(col, index);

    let nextDirection: SortDirection = "asc";
    if (activeSortBy === colKey) {
      nextDirection = activeSortOrder === "asc" ? "desc" : "asc";
    }

    if (isServerSort) {
      onSort(colKey, nextDirection);
    } else {
      setInternalSortBy(colKey);
      setInternalSortOrder(nextDirection);
    }
  };

  // Internal sort comparator for client-side mode
  const sortedData = useMemo(() => {
    if (isServerSort || !activeSortBy || !activeSortOrder) {
      return data;
    }

    const sortColumn = columns.find(
      (c, idx) => (c.sortKey || resolveColKey(c, idx)) === activeSortBy,
    );
    if (!sortColumn) return data;

    return [...data].sort((a, b) => {
      let aVal: unknown;
      let bVal: unknown;

      if (typeof sortColumn.accessor === "function") {
        aVal = sortColumn.accessor(a);
        bVal = sortColumn.accessor(b);
      } else if (sortColumn.accessor && typeof a === "object" && a !== null) {
        // biome-ignore lint/suspicious/noExplicitAny: dynamic accessor
        aVal = (a as any)[sortColumn.accessor];
        // biome-ignore lint/suspicious/noExplicitAny: dynamic accessor
        bVal = (b as any)[sortColumn.accessor];
      }

      // Handle nullish values
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;

      // Numbers
      if (typeof aVal === "number" && typeof bVal === "number") {
        return activeSortOrder === "asc" ? aVal - bVal : bVal - aVal;
      }

      // Dates (chronological sort)
      if (aVal instanceof Date && bVal instanceof Date) {
        return activeSortOrder === "asc"
          ? aVal.getTime() - bVal.getTime()
          : bVal.getTime() - aVal.getTime();
      }

      // Booleans
      if (typeof aVal === "boolean" && typeof bVal === "boolean") {
        const aNum = aVal ? 1 : 0;
        const bNum = bVal ? 1 : 0;
        return activeSortOrder === "asc" ? aNum - bNum : bNum - aNum;
      }

      // Strings (case-insensitive)
      const aStr = String(aVal);
      const bStr = String(bVal);
      const comp = aStr.localeCompare(bStr, undefined, { numeric: true, sensitivity: "base" });
      return activeSortOrder === "asc" ? comp : -comp;
    });
  }, [data, isServerSort, activeSortBy, activeSortOrder, columns, resolveColKey]);

  // Selection keys set
  const currentSelectedSet = useMemo(() => {
    if (selectedRowKeys instanceof Set) return selectedRowKeys;
    if (Array.isArray(selectedRowKeys)) return new Set(selectedRowKeys);
    return internalSelectedKeys;
  }, [selectedRowKeys, internalSelectedKeys]);

  // Expanded keys set
  const currentExpandedSet = useMemo(() => {
    if (controlledExpandedRowKeys instanceof Set) return controlledExpandedRowKeys;
    if (Array.isArray(controlledExpandedRowKeys)) return new Set(controlledExpandedRowKeys);
    return internalExpandedKeys;
  }, [controlledExpandedRowKeys, internalExpandedKeys]);

  // Row selection handler
  const handleRowSelect = (rowId: string, _row: T, checked: boolean) => {
    const nextSet = new Set(currentSelectedSet);
    if (checked) {
      nextSet.add(rowId);
    } else {
      nextSet.delete(rowId);
    }

    if (!selectedRowKeys) {
      setInternalSelectedKeys(nextSet);
    }

    if (onSelectionChange) {
      const selectedKeysArr = Array.from(nextSet);
      const selectedRows = sortedData.filter((r, idx) => nextSet.has(resolveRowId(r, idx)));
      onSelectionChange(selectedKeysArr, selectedRows);
    }
  };

  // Select all rows handler (preserves selections across other pages)
  const handleSelectAll = (checked: boolean) => {
    const nextSet = new Set(currentSelectedSet);
    sortedData.forEach((row, idx) => {
      const id = resolveRowId(row, idx);
      if (checked) {
        nextSet.add(id);
      } else {
        nextSet.delete(id);
      }
    });

    if (!selectedRowKeys) {
      setInternalSelectedKeys(nextSet);
    }

    if (onSelectionChange) {
      const selectedKeysArr = Array.from(nextSet);
      const selectedRows = sortedData.filter((r, idx) => nextSet.has(resolveRowId(r, idx)));
      onSelectionChange(selectedKeysArr, selectedRows);
    }
  };

  // Toggle row expansion handler
  const handleToggleExpand = (rowId: string, row: T) => {
    if (onToggleExpandRow) {
      onToggleExpandRow(rowId, row);
      return;
    }

    setInternalExpandedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(rowId)) {
        next.delete(rowId);
      } else {
        next.add(rowId);
      }
      return next;
    });
  };

  // Determine "select all" state
  const isAllSelected =
    sortedData.length > 0 &&
    sortedData.every((row, idx) => currentSelectedSet.has(resolveRowId(row, idx)));
  const isSomeSelected =
    !isAllSelected && sortedData.some((row, idx) => currentSelectedSet.has(resolveRowId(row, idx)));

  // Total columns count (including selection & expander columns)
  const totalColumnCount = columns.length + (selectable ? 1 : 0) + (renderExpandedRow ? 1 : 0);

  // Active theme sort icon color
  const sortIconColorClass = {
    admin: "text-[#0052cc]",
    restaurant: "text-[#ff6b00]",
    customer: "text-[#ff6b00]",
    brand: "text-[#ff6b00]",
    dark: "text-slate-900",
  }[theme];

  return (
    <div
      className={cn(
        "w-full rounded-2xl border border-border/80 bg-card overflow-hidden shadow-2xs",
        className,
      )}
      data-testid={testId}
    >
      <Table
        containerClassName={containerClassName}
        className={tableClassName}
        aria-label={ariaLabel}
        aria-busy={isLoading}
      >
        {caption && <caption className="sr-only">{caption}</caption>}

        {/* TABLE HEADER */}
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
                      // If already all selected -> deselect all. If some or none -> select all.
                      handleSelectAll(!isAllSelected);
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
                      onClick={() => handleSortClick(col, colIdx)}
                      className={cn(
                        "inline-flex items-center gap-1.5 font-bold uppercase transition-colors group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-sm px-1 -mx-1",
                        alignClass,
                        isSorted
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-foreground",
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

        {/* TABLE BODY */}
        {isLoading ? (
          loadingRenderer ? (
            <TableBody className={bodyClassName}>
              <TableRow>
                <TableCell colSpan={totalColumnCount} className="py-12 text-center">
                  {loadingRenderer}
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <DataTableSkeleton
              columnsCount={columns.length}
              rowCount={loadingRowCount}
              hasSelection={selectable}
              hasExpander={Boolean(renderExpandedRow)}
              className={bodyClassName}
            />
          )
        ) : error ? (
          <TableBody className={bodyClassName} data-testid="data-table-error">
            <TableRow>
              <TableCell colSpan={totalColumnCount} className="py-12 text-center text-rose-600">
                {error}
              </TableCell>
            </TableRow>
          </TableBody>
        ) : sortedData.length === 0 ? (
          <DataTableEmptyState
            colSpan={totalColumnCount}
            customContent={emptyState}
            title={emptyTitle}
            description={emptyDescription}
            action={emptyAction}
            className={bodyClassName}
          />
        ) : (
          <TableBody className={bodyClassName} data-testid="data-table-body">
            {sortedData.map((row, rowIdx) => {
              const rowId = resolveRowId(row, rowIdx);
              const isSelected = currentSelectedSet.has(rowId);
              const isExpanded = currentExpandedSet.has(rowId);

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
                      if (
                        onRowClick &&
                        (e.key === "Enter" || e.key === " ") &&
                        e.target === e.currentTarget
                      ) {
                        e.preventDefault();
                        onRowClick(row, e);
                      }
                    }}
                    className={cn(
                      onRowClick &&
                        "cursor-pointer focus:outline-none focus-visible:bg-muted/60 focus-visible:ring-1 focus-visible:ring-ring",
                      computedRowClass,
                    )}
                    data-testid={
                      getRowTestId ? getRowTestId(row, rowIdx) : `data-table-row-${rowId}`
                    }
                  >
                    {/* Expand Toggle Cell */}
                    {renderExpandedRow && (
                      <TableCell className="w-10 px-3 text-center">
                        <button
                          type="button"
                          aria-expanded={isExpanded}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleExpand(rowId, row);
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
                            onCheckedChange={(checked) =>
                              handleRowSelect(rowId, row, checked === true)
                            }
                            aria-label={`Select row ${rowIdx + 1}`}
                            data-testid={`data-table-select-row-${rowId}`}
                          />
                        </div>
                      </TableCell>
                    )}

                    {/* Dynamic Data Cells */}
                    {columns.map((col, colIdx) => {
                      const colKey = col.sortKey || resolveColKey(col, colIdx);

                      // Resolve raw cell value
                      let value: unknown;
                      if (typeof col.accessor === "function") {
                        value = col.accessor(row);
                      } else if (col.accessor && typeof row === "object" && row !== null) {
                        // biome-ignore lint/suspicious/noExplicitAny: dynamic accessor
                        value = (row as any)[col.accessor];
                      }

                      // Render cell content
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
            })}
          </TableBody>
        )}
      </Table>

      {/* PAGINATION TOOLBAR */}
      {pagination && !isLoading && (
        <DataTablePagination {...pagination} theme={pagination.theme || theme} />
      )}
    </div>
  );
}
