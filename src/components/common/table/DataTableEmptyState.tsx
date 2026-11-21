import { Inbox } from "lucide-react";
import type React from "react";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils/cn";

export interface DataTableEmptyStateProps {
  colSpan: number;
  customContent?: React.ReactNode;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function DataTableEmptyState({
  colSpan,
  customContent,
  title = "No data found",
  description = "There are no records matching your current criteria.",
  action,
  className,
}: DataTableEmptyStateProps) {
  return (
    <TableBody data-testid="data-table-empty">
      <TableRow className="hover:bg-transparent">
        <TableCell colSpan={colSpan} className={cn("py-16 text-center", className)}>
          {customContent ? (
            customContent
          ) : (
            <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
              <div className="size-14 rounded-2xl bg-muted/60 border border-border/80 flex items-center justify-center text-muted-foreground mb-3">
                <Inbox className="size-7 stroke-[1.5]" />
              </div>
              <h3 className="text-base font-semibold text-foreground">{title}</h3>
              {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
              {action && <div className="mt-4">{action}</div>}
            </div>
          )}
        </TableCell>
      </TableRow>
    </TableBody>
  );
}
