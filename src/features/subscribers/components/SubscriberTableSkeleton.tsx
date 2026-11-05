import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SUBSCRIBER_MESSAGES } from "../constants/subscriber.constants";

export interface SubscriberTableSkeletonProps {
  rowCount?: number;
}

export function SubscriberTableSkeleton({ rowCount = 5 }: SubscriberTableSkeletonProps) {
  return (
    <div
      className="overflow-hidden rounded-xl border border-slate-200 bg-white"
      data-testid="subscriber-table-skeleton"
    >
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50/75 hover:bg-slate-50/75">
            <TableHead className="font-semibold text-slate-700">
              {SUBSCRIBER_MESSAGES.TABLE_HEADER_RESTAURANT}
            </TableHead>
            <TableHead className="font-semibold text-slate-700">
              {SUBSCRIBER_MESSAGES.TABLE_HEADER_SUBSCRIBER}
            </TableHead>
            <TableHead className="font-semibold text-slate-700">
              {SUBSCRIBER_MESSAGES.TABLE_HEADER_PLAN}
            </TableHead>
            <TableHead className="font-semibold text-slate-700">
              {SUBSCRIBER_MESSAGES.TABLE_HEADER_CYCLE}
            </TableHead>
            <TableHead className="font-semibold text-slate-700">
              {SUBSCRIBER_MESSAGES.TABLE_HEADER_PRICE}
            </TableHead>
            <TableHead className="font-semibold text-slate-700">
              {SUBSCRIBER_MESSAGES.TABLE_HEADER_STATUS}
            </TableHead>
            <TableHead className="font-semibold text-slate-700">
              {SUBSCRIBER_MESSAGES.TABLE_HEADER_START_DATE}
            </TableHead>
            <TableHead className="font-semibold text-slate-700">
              {SUBSCRIBER_MESSAGES.TABLE_HEADER_RENEWAL}
            </TableHead>
            <TableHead className="text-right font-semibold text-slate-700">
              {SUBSCRIBER_MESSAGES.TABLE_HEADER_ACTIONS}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rowCount }).map((_, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton items
            <TableRow key={index} className="hover:bg-transparent">
              <TableCell>
                <Skeleton className="h-4 w-28" />
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-3 w-14" />
                </div>
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-16 rounded-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-20" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-20 rounded-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-20" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-20" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="ml-auto h-8 w-24 rounded-lg" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
