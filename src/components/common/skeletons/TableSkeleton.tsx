import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils/cn";

export interface TableSkeletonProps {
  columns?: number | string[];
  rowCount?: number;
  hasAvatar?: boolean;
  hasActions?: boolean;
  className?: string;
}

export function TableSkeleton({
  columns = 4,
  rowCount = 5,
  hasAvatar = false,
  hasActions = true,
  className,
}: TableSkeletonProps) {
  const columnTitles = Array.isArray(columns)
    ? columns
    : Array.from({ length: columns }, (_, i) => `COLUMN ${i + 1}`);

  const columnsList = columnTitles.map((title, i) => ({
    id: `col-${i}-${title}`,
    title,
    isFirst: i === 0,
    isLast: i === columnTitles.length - 1,
  }));

  const rowKeys = Array.from({ length: rowCount }, (_, i) => `table-row-${i}`);

  return (
    <div
      data-slot="table-skeleton"
      className={cn("w-full overflow-hidden rounded-xl border border-border/60 bg-card", className)}
    >
      <Table className="w-full text-left text-xs">
        <TableHeader className="bg-muted/40 text-muted-foreground font-semibold border-b border-border/80">
          <TableRow>
            {columnsList.map((col) => (
              <TableHead
                key={col.id}
                className={cn("py-3.5 px-6", col.isLast && hasActions && "text-right")}
              >
                {col.title}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-border/40">
          {rowKeys.map((rowKey) => (
            <TableRow key={rowKey} className="animate-pulse">
              {columnsList.map((col) => (
                <TableCell
                  key={`${rowKey}-${col.id}`}
                  className={cn("py-4 px-6", col.isLast && hasActions && "text-right")}
                >
                  {col.isFirst && hasAvatar ? (
                    <div className="flex items-center gap-3">
                      <Skeleton className="size-10 rounded-full shrink-0 bg-muted/80" />
                      <div className="space-y-1.5">
                        <Skeleton className="h-3.5 w-28 bg-muted/80" />
                        <Skeleton className="h-2.5 w-36 bg-muted/50" />
                      </div>
                    </div>
                  ) : col.isLast && hasActions ? (
                    <div className="flex justify-end gap-2">
                      <Skeleton className="size-7 rounded bg-muted/60" />
                      <Skeleton className="size-7 rounded bg-muted/60" />
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <Skeleton className="h-3.5 w-24 bg-muted/70" />
                      <Skeleton className="h-2.5 w-16 bg-muted/40" />
                    </div>
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
