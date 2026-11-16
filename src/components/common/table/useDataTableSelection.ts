import { useMemo, useState } from "react";

export interface UseDataTableSelectionProps<T> {
  sortedData: readonly T[];
  resolveRowId: (row: T, index: number) => string;
  selectedRowKeys?: Set<string> | string[];
  onSelectionChange?: (selectedKeys: string[], selectedRows: T[]) => void;
  controlledExpandedRowKeys?: Set<string> | string[];
  onToggleExpandRow?: (rowId: string, row: T) => void;
}

export function useDataTableSelection<T>({
  sortedData,
  resolveRowId,
  selectedRowKeys,
  onSelectionChange,
  controlledExpandedRowKeys,
  onToggleExpandRow,
}: UseDataTableSelectionProps<T>) {
  // Uncontrolled selection state
  const [internalSelectedKeys, setInternalSelectedKeys] = useState<Set<string>>(new Set());

  // Uncontrolled expansion state
  const [internalExpandedKeys, setInternalExpandedKeys] = useState<Set<string>>(new Set());

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

  // Select all rows handler
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

  const isAllSelected =
    sortedData.length > 0 &&
    sortedData.every((row, idx) => currentSelectedSet.has(resolveRowId(row, idx)));
  const isSomeSelected =
    !isAllSelected && sortedData.some((row, idx) => currentSelectedSet.has(resolveRowId(row, idx)));

  return {
    currentSelectedSet,
    currentExpandedSet,
    handleRowSelect,
    handleSelectAll,
    handleToggleExpand,
    isAllSelected,
    isSomeSelected,
  };
}

