export function RestaurantStaffStatusBadge({ status }: { status: string }) {
  switch (status?.toUpperCase()) {
    case "ACTIVE":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
          <span className="size-1.5 rounded-full bg-emerald-500" />
          Active
        </span>
      );
    case "INACTIVE":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-semibold text-neutral-600 border border-neutral-200">
          <span className="size-1.5 rounded-full bg-neutral-400" />
          Inactive
        </span>
      );
    case "SUSPENDED":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 border border-amber-200">
          <span className="size-1.5 rounded-full bg-amber-500" />
          Suspended
        </span>
      );
    case "INVITED":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700 border border-sky-200">
          <span className="size-1.5 rounded-full bg-sky-500" />
          Invited
        </span>
      );
    case "REMOVED":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 border border-rose-200">
          <span className="size-1.5 rounded-full bg-rose-500" />
          Removed
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fef3ec] px-2.5 py-1 text-xs font-semibold text-[#9a3412] border border-[#fae2d3]">
          <span className="size-1.5 rounded-full bg-[#e8631b]" />
          {status || "Active"}
        </span>
      );
  }
}
