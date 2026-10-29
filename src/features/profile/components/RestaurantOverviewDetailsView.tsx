import { Building2, Phone, User } from "lucide-react";

interface RestaurantOverviewDetailsViewProps {
  name: string;
  phone: string;
  ownerName: string;
}

export function RestaurantOverviewDetailsView({
  name,
  phone,
  ownerName,
}: RestaurantOverviewDetailsViewProps) {
  return (
    <div className="space-y-4">
      <div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fef3ec] px-2.5 py-0.5 text-xs font-bold text-[#9a3412] border border-[#fae2d3]">
          <Building2 className="size-3" />
          Verified Restaurant
        </span>
        <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-neutral-900 leading-tight">
          {name}
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <div className="flex items-center gap-3 rounded-2xl border border-[#f3e6de] bg-[#fffcf9] p-3.5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-[#fef3ec] text-[#e8631b]">
            <Phone className="size-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
              Contact Phone
            </p>
            <p className="text-sm font-bold text-neutral-900 truncate">{phone}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-[#f3e6de] bg-[#fffcf9] p-3.5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-[#fef3ec] text-[#e8631b]">
            <User className="size-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
              Owner Name
            </p>
            <p className="text-sm font-bold text-neutral-900 truncate">{ownerName}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
