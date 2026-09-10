export function CustomerTableSkeleton({ rowCount = 5 }: { rowCount?: number }) {
  return (
    <div className="w-full overflow-hidden" data-testid="customer-table-skeleton">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#f0edf1]/60 text-slate-500 font-semibold border-b border-slate-200/80">
            <tr>
              <th className="py-3.5 px-6">USER PROFILE</th>
              <th className="py-3.5 px-6">CONTACT INFO</th>
              <th className="py-3.5 px-6">STATUS</th>
              <th className="py-3.5 px-6 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {Array.from({ length: rowCount }).map((_, idx) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: skeleton rows
              <tr key={idx} className="animate-pulse">
                {/* User Profile */}
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-slate-200 shrink-0" />
                    <div className="space-y-1.5">
                      <div className="h-3.5 w-28 rounded bg-slate-200" />
                      <div className="h-2.5 w-36 rounded bg-slate-100" />
                    </div>
                  </div>
                </td>

                {/* Contact Info */}
                <td className="py-4 px-6">
                  <div className="space-y-1.5">
                    <div className="h-3.5 w-40 rounded bg-slate-200" />
                    <div className="h-2.5 w-24 rounded bg-slate-100" />
                  </div>
                </td>

                {/* Status */}
                <td className="py-4 px-6">
                  <div className="h-6 w-20 rounded-full bg-slate-200" />
                </td>

                {/* Actions */}
                <td className="py-4 px-6 text-right">
                  <div className="size-8 rounded-full bg-slate-200 ml-auto" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CustomerTableSkeleton;
