import { DollarSign, Edit3, FileText, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { RestaurantProfileDetails } from "../types/restaurant-profile.types";

interface RestaurantInfoCardProps {
  profile: RestaurantProfileDetails;
}

export function RestaurantInfoCard({ profile }: RestaurantInfoCardProps) {
  const description = profile.description?.trim() || "No description provided.";
  const cuisineType = profile.cuisineType?.trim() || "Not specified";
  const averageCost =
    profile.averageCost && profile.averageCost > 0
      ? `₹${profile.averageCost.toLocaleString()}`
      : "Not specified";

  return (
    <div className="rounded-3xl border border-[#eddcd4] bg-white p-6 sm:p-8 shadow-2xs space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-neutral-900">Restaurant Information</h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            Cuisine preferences, pricing range, and public business description
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          disabled
          className="rounded-xl border-[#eddcd4] bg-[#faf7f5] text-neutral-400 font-semibold cursor-not-allowed text-xs h-9 px-4 shrink-0"
          title="Update functionality placeholder"
        >
          <Edit3 className="size-3.5 mr-1.5" />
          <span>Update Info</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-start gap-3.5 rounded-2xl border border-[#f3e6de] bg-[#fffcf9] p-4">
          <div className="flex size-9 items-center justify-center rounded-xl bg-[#fef3ec] text-[#e8631b] shrink-0 mt-0.5">
            <UtensilsCrossed className="size-4.5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Cuisine Type
            </p>
            <p className="mt-1 text-base font-bold text-neutral-900">{cuisineType}</p>
          </div>
        </div>

        <div className="flex items-start gap-3.5 rounded-2xl border border-[#f3e6de] bg-[#fffcf9] p-4">
          <div className="flex size-9 items-center justify-center rounded-xl bg-[#fef3ec] text-[#e8631b] shrink-0 mt-0.5">
            <DollarSign className="size-4.5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Average Cost (For Two)
            </p>
            <p className="mt-1 text-base font-bold text-neutral-900">{averageCost}</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-[#f3e6de] bg-[#fffcf9] p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-2 text-neutral-500">
          <FileText className="size-4 text-[#e8631b]" />
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
            About the Restaurant
          </span>
        </div>
        <p className="text-sm text-neutral-700 leading-relaxed whitespace-pre-line">
          {description}
        </p>
      </div>
    </div>
  );
}
