import type React from "react";

export type SortDirection = "asc" | "desc";

export interface Column<T> {
  /** Unique key/identifier for the column. Defaults to accessor if accessor is a string key. */
  key?: string;
  /** Alias for key for TanStack/Shadcn compatibility */
  id?: string;
  /** Header label or render function */
  header:
    | React.ReactNode
    | ((context: { column: Column<T>; sortDirection?: SortDirection | null }) => React.ReactNode);
  /** Key of T or function that extracts the display value */
  accessor?: keyof T | ((row: T) => React.ReactNode);
  /** Optional custom cell renderer */
  cell?: (context: { row: T; value: unknown; index: number }) => React.ReactNode;
  /** Whether this column is sortable */
  sortable?: boolean;
  /** Field name sent to server if sorting is handled on server side */
  sortKey?: string;
  /** Text alignment */
  align?: "left" | "center" | "right";
  /** Custom CSS classes for the cell `<td>` */
  className?: string;
  /** Custom CSS classes for the header `<th>` */
  headerClassName?: string;
  /** Explicit column width (e.g., '120px' or '20%') */
  width?: string | number;
}

export interface DataTablePaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  showFirstLast?: boolean;
  siblingCount?: number;
  theme?: "admin" | "restaurant" | "customer" | "brand" | "dark";
  disabled?: boolean;
  className?: string;
}

export interface DataTableProps<T> {
  /** Array of row data */
  data: readonly T[];
  /** Column definitions */
  columns: Column<T>[];
  /** Unique row key extractor. Defaults to row.id or array index. */
  getRowId?: (row: T, index: number) => string;
  /** Optional custom test-id extractor for rows */
  getRowTestId?: (row: T, index: number) => string;

  // Loading, Empty & Error states
  isLoading?: boolean;
  loadingRowCount?: number;
  loadingRenderer?: React.ReactNode;
  error?: React.ReactNode | null;
  emptyState?: React.ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: React.ReactNode;

  // Sorting
  /** Current active sort key */
  sortBy?: string | null;
  /** Current active sort direction */
  sortOrder?: SortDirection | null;
  /**
   * Callback for sort changes.
   * If provided, server-side sorting mode is active.
   * If omitted, client-side sorting is applied in-memory.
   */
  onSort?: (key: string, direction: SortDirection) => void;
  /** Default sort key for initial client-side sort */
  defaultSortBy?: string;
  /** Default sort direction for initial client-side sort */
  defaultSortOrder?: SortDirection;

  // Row Interactions
  /** Row click callback */
  onRowClick?: (
    row: T,
    event: React.MouseEvent<HTMLTableRowElement> | React.KeyboardEvent<HTMLTableRowElement>,
  ) => void;
  /** Custom row class name */
  rowClassName?: string | ((row: T, index: number) => string);

  // Selection
  /** Enable row selection checkboxes */
  selectable?: boolean;
  /** Currently selected row keys */
  selectedRowKeys?: string[] | Set<string>;
  /** Selection change callback */
  onSelectionChange?: (selectedKeys: string[], selectedRows: T[]) => void;

  // Expandable Rows
  /** Function rendering expanded row content */
  renderExpandedRow?: (row: T, index: number) => React.ReactNode;
  /** Set of expanded row keys or predicate function */
  expandedRowKeys?: string[] | Set<string>;
  /** Toggle expanded row callback */
  onToggleExpandRow?: (rowId: string, row: T) => void;

  // Pagination
  pagination?: DataTablePaginationProps;

  // Visual & Accessibility
  caption?: string;
  theme?: "admin" | "restaurant" | "customer" | "brand" | "dark";
  className?: string;
  containerClassName?: string;
  tableClassName?: string;
  headerClassName?: string;
  bodyClassName?: string;
  "aria-label"?: string;
  testId?: string;
}
