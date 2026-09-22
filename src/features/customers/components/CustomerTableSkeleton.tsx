import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function CustomerTableSkeleton({ rowCount = 5 }: { rowCount?: number }) {
  return (
    <div className="w-full overflow-hidden" data-testid="customer-table-skeleton">
      <Table className="w-full text-left text-xs">
        <TableHeader className="bg-[#f0edf1]/60 text-slate-500 font-semibold border-b border-slate-200/80">
          <TableRow>
            <TableHead className="py-3.5 px-6">USER PROFILE</TableHead>
            <TableHead className="py-3.5 px-6">CONTACT INFO</TableHead>
            <TableHead className="py-3.5 px-6">STATUS</TableHead>
            <TableHead className="py-3.5 px-6 text-right">ACTIONS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-slate-100">
          {Array.from({ length: rowCount }).map((_, idx) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton rows
            <TableRow key={idx} className="animate-pulse">
              {/* User Profile */}
              <TableCell className="py-4 px-6">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-slate-200 shrink-0" />
                  <div className="space-y-1.5">
                    <div className="h-3.5 w-28 rounded bg-slate-200" />
                    <div className="h-2.5 w-36 rounded bg-slate-100" />
                  </div>
                </div>
              </TableCell>

              {/* Contact Info */}
              <TableCell className="py-4 px-6">
                <div className="space-y-1.5">
                  <div className="h-3.5 w-40 rounded bg-slate-200" />
                  <div className="h-2.5 w-24 rounded bg-slate-100" />
                </div>
              </TableCell>

              {/* Status */}
              <TableCell className="py-4 px-6">
                <div className="h-6 w-20 rounded-full bg-slate-200" />
              </TableCell>

              {/* Actions */}
              <TableCell className="py-4 px-6 text-right">
                <div className="size-8 rounded-full bg-slate-200 ml-auto" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default CustomerTableSkeleton;
