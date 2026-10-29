import type { Column, SortDirection } from "./DataTable.types";

export function sortData<T>(
  data: readonly T[],
  columns: Column<T>[],
  activeSortBy: string | null | undefined,
  activeSortOrder: SortDirection | null | undefined,
  resolveColKey: (col: Column<T>, idx: number) => string,
): readonly T[] {
  if (!activeSortBy || !activeSortOrder) {
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
}
