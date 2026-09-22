import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils/cn";

export interface DataTableSkeletonProps {
  columnsCount: number;
  rowCount?: number;
  hasSelection?: boolean;
  className?: string;
}

export function DataTableSkeleton({
  columnsCount,
  rowCount = 5,
  hasSelection = false,
  className,
}: DataTableSkeletonProps) {
  const totalColumns = hasSelection ? columnsCount + 1 : columnsCount;

  return (
    <TableBody className={className} data-testid="data-table-skeleton">
      {Array.from({ length: rowCount }).map((_, rowIndex) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: skeleton rows
        <TableRow key={`skeleton-row-${rowIndex}`} className="animate-pulse">
          {Array.from({ length: totalColumns }).map((__, colIndex) => {
            // First column when selection enabled is a small checkbox box
            if (hasSelection && colIndex === 0) {
              return (
                // biome-ignore lint/suspicious/noArrayIndexKey: skeleton cells
                <TableCell key={`skeleton-cell-${rowIndex}-${colIndex}`} className="w-12">
                  <div className="size-4 rounded bg-muted/70" />
                </TableCell>
              );
            }

            // Stagger width of placeholders for organic loading look
            const widthClass =
              colIndex % 3 === 0
                ? "w-3/4 max-w-[140px]"
                : colIndex % 3 === 1
                  ? "w-1/2 max-w-[100px]"
                  : "w-4/5 max-w-[180px]";

            return (
              // biome-ignore lint/suspicious/noArrayIndexKey: skeleton cells
              <TableCell key={`skeleton-cell-${rowIndex}-${colIndex}`}>
                <div className={cn("h-4 rounded bg-muted/60", widthClass)} />
              </TableCell>
            );
          })}
        </TableRow>
      ))}
    </TableBody>
  );
}
