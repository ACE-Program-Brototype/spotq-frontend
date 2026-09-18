import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RestaurantBusinessHoursCard } from "../components/RestaurantBusinessHoursCard";
import { RestaurantInfoCard } from "../components/RestaurantInfoCard";
import { RestaurantOverviewCard } from "../components/RestaurantOverviewCard";
import { RestaurantProfileSkeleton } from "../components/RestaurantProfileSkeleton";
import { RestaurantSettingsCard } from "../components/RestaurantSettingsCard";
import { useRestaurantProfile } from "../hooks/use-restaurant-profile";

export default function RestaurantProfilePage() {
  const { data, isLoading, isError, error, refetch, isFetching } = useRestaurantProfile();

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#9a3412]">
            Restaurant Management
          </span>
          <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-neutral-900">
            Restaurant Profile
          </h1>
        </div>
        <RestaurantProfileSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#9a3412]">
            Restaurant Management
          </span>
          <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-neutral-900">
            Restaurant Profile
          </h1>
        </div>

        <div className="flex flex-col items-center justify-center rounded-3xl bg-white p-8 sm:p-12 text-center border border-red-100 shadow-2xs gap-4">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-red-50 text-red-600 border border-red-100">
            <AlertCircle className="size-7" />
          </div>
          <div className="flex flex-col gap-1 max-w-md">
            <h3 className="text-lg font-bold text-neutral-900">
              Failed to load restaurant profile
            </h3>
            <p className="text-xs sm:text-sm text-neutral-500">
              {error?.message || "An unexpected error occurred while retrieving profile data."}
            </p>
          </div>
          <Button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="mt-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold px-5 py-2.5 gap-2"
          >
            <RefreshCw className={`size-3.5 ${isFetching ? "animate-spin" : ""}`} />
            <span>{isFetching ? "Retrying..." : "Retry Loading"}</span>
          </Button>
        </div>
      </div>
    );
  }

  const restaurantData = data || {
    restaurant: {
      name: "SpotQ Restaurant",
      phone: "Not provided",
      ownerName: "Not provided",
    },
    profile: {
      logo: null,
      coverImage: null,
      description: "No description available.",
      cuisineType: "Not specified",
      averageCost: 0,
    },
    settings: {
      acceptsQueue: true,
      acceptsQrOrders: true,
      loyaltyEnabled: false,
      autoAcceptQueue: false,
      seatingCapacity: 0,
    },
    businessHours: [],
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#9a3412]">
          Restaurant Management
        </span>
        <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-neutral-900">Restaurant Profile</h1>
        <p className="mt-1 text-sm text-neutral-500">
          View your restaurant details, operational preferences, and weekly opening hours.
        </p>
      </div>

      {/* 1. Overview */}
      <RestaurantOverviewCard
        restaurant={restaurantData.restaurant}
        profile={restaurantData.profile}
        fullData={restaurantData}
      />

      {/* 2. Info */}
      <RestaurantInfoCard profile={restaurantData.profile} fullData={restaurantData} />

      {/* 3. Settings */}
      <RestaurantSettingsCard settings={restaurantData.settings} fullData={restaurantData} />

      {/* 4. Business Hours */}
      <RestaurantBusinessHoursCard
        businessHours={restaurantData.businessHours}
        fullData={restaurantData}
      />
    </div>
  );
}
