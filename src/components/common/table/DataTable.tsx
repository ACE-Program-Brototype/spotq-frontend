import { useCallback, useId, useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils/cn";
import type { Column, DataTableProps, SortDirection } from "./DataTable.types";
import { DataTableEmptyState } from "./DataTableEmptyState";
import { DataTableHeader } from "./DataTableHeader";
import { DataTablePagination } from "./DataTablePagination";
import { DataTableRow } from "./DataTableRow";
import { DataTableSkeleton } from "./DataTableSkeleton";
import { sortData } from "./dataTableSort";
import { useDataTableSelection } from "./useDataTableSelection";

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

  // Internal client-side sort state
  const [internalSortBy, setInternalSortBy] = useState<string | null>(defaultSortBy || null);
  const [internalSortOrder, setInternalSortOrder] = useState<SortDirection>(defaultSortOrder);

  // Active sort state
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

  // Internal sorted data memo
  const sortedData = useMemo(() => {
    if (isServerSort) return data;
    return sortData(data, columns, activeSortBy, activeSortOrder, resolveColKey);
  }, [data, isServerSort, activeSortBy, activeSortOrder, columns, resolveColKey]);

  // Selection & expansion management
  const {
    currentSelectedSet,
    currentExpandedSet,
    handleRowSelect,
    handleSelectAll,
    handleToggleExpand,
    isAllSelected,
    isSomeSelected,
  } = useDataTableSelection({
    sortedData,
    resolveRowId,
    selectedRowKeys,
    onSelectionChange,
    controlledExpandedRowKeys,
    onToggleExpandRow,
  });

  const totalColumnCount = columns.length + (selectable ? 1 : 0) + (renderExpandedRow ? 1 : 0);

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
        "w-full min-w-0 max-w-full rounded-2xl border border-border/80 bg-card overflow-hidden shadow-2xs",
        className,
      )}
      data-testid={testId}
    >
      <Table
        containerClassName={cn(
          "w-full min-w-0 max-w-full overscroll-x-contain",
          containerClassName,
        )}
        className={tableClassName}
        aria-label={ariaLabel}
        aria-busy={isLoading}
      >
        {caption && <caption className="sr-only">{caption}</caption>}

        <DataTableHeader
          columns={columns}
          selectable={selectable}
          renderExpandedRow={renderExpandedRow}
          isAllSelected={isAllSelected}
          isSomeSelected={isSomeSelected}
          onSelectAll={handleSelectAll}
          activeSortBy={activeSortBy}
          activeSortOrder={activeSortOrder}
          onSortClick={handleSortClick}
          resolveColKey={resolveColKey}
          sortIconColorClass={sortIconColorClass}
          headerClassName={headerClassName}
        />

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
            {sortedData.map((row, rowIdx) => (
              <DataTableRow
                key={resolveRowId(row, rowIdx)}
                row={row}
                rowIdx={rowIdx}
                rowId={resolveRowId(row, rowIdx)}
                columns={columns}
                totalColumnCount={totalColumnCount}
                isSelected={currentSelectedSet.has(resolveRowId(row, rowIdx))}
                isExpanded={currentExpandedSet.has(resolveRowId(row, rowIdx))}
                selectable={selectable}
                renderExpandedRow={renderExpandedRow}
                onRowClick={onRowClick}
                rowClassName={rowClassName}
                getRowTestId={getRowTestId}
                onRowSelect={handleRowSelect}
                onToggleExpand={handleToggleExpand}
                resolveColKey={resolveColKey}
              />
            ))}
          </TableBody>
        )}
      </Table>

      {pagination && !isLoading && (
        <DataTablePagination {...pagination} theme={pagination.theme || theme} />
      )}
    </div>
  );
}
