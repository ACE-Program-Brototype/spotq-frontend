import { Check, DollarSign, Edit3, FileText, Loader2, UtensilsCrossed, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateRestaurantProfile } from "../hooks/use-update-restaurant-profile";
import type {
  RestaurantProfileData,
  RestaurantProfileDetails,
  UpdateRestaurantProfilePayload,
} from "../types/restaurant-profile.types";

interface RestaurantInfoCardProps {
  profile: RestaurantProfileDetails;
  fullData: RestaurantProfileData;
}

export function RestaurantInfoCard({ profile, fullData }: RestaurantInfoCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [cuisineType, setCuisineType] = useState(profile.cuisineType || "");
  const [averageCost, setAverageCost] = useState<number | "">(
    profile.averageCost && profile.averageCost > 0 ? profile.averageCost : "",
  );
  const [description, setDescription] = useState(profile.description || "");
  const [validationError, setValidationError] = useState<string | null>(null);

  const updateMutation = useUpdateRestaurantProfile();

  const handleStartEdit = () => {
    setCuisineType(profile.cuisineType || "");
    setAverageCost(profile.averageCost && profile.averageCost > 0 ? profile.averageCost : "");
    setDescription(profile.description || "");
    setValidationError(null);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setValidationError(null);
  };

  const handleSave = () => {
    const costNumber = typeof averageCost === "number" ? averageCost : Number(averageCost);

    if (averageCost !== "" && (Number.isNaN(costNumber) || costNumber < 0)) {
      setValidationError("Average cost must be a valid positive number.");
      return;
    }

    setValidationError(null);

    const payload: UpdateRestaurantProfilePayload = {
      restaurant: {
        name: fullData.restaurant.name,
        phone: fullData.restaurant.phone,
        ownerName: fullData.restaurant.ownerName,
      },
      profile: {
        description: description.trim() || null,
        cuisineType: cuisineType.trim() || null,
        averageCost: typeof averageCost === "number" ? averageCost : costNumber || 0,
      },
      settings: fullData.settings,
      businessHours: fullData.businessHours.map((bh) => ({
        dayOfWeek: bh.dayOfWeek,
        openTime: bh.openTime,
        closeTime: bh.closeTime,
        isClosed: bh.isClosed,
      })),
    };

    updateMutation.mutate(payload, {
      onSuccess: () => {
        setIsEditing(false);
      },
    });
  };

  const isSaving = updateMutation.isPending;

  const displayDescription = profile.description?.trim() || "No description provided.";
  const displayCuisineType = profile.cuisineType?.trim() || "Not specified";
  const displayAverageCost =
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

        {!isEditing ? (
          <Button
            type="button"
            variant="outline"
            onClick={handleStartEdit}
            className="rounded-xl border-[#eddcd4] bg-[#faf7f5] text-neutral-800 hover:bg-[#f3e6de] font-semibold text-xs h-9 px-4 shrink-0 cursor-pointer"
          >
            <Edit3 className="size-3.5 mr-1.5 text-[#e8631b]" />
            <span>Edit Info</span>
          </Button>
        ) : (
          <div className="flex items-center gap-2 shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSaving}
              className="rounded-xl border-neutral-200 text-neutral-700 hover:bg-neutral-100 font-semibold text-xs h-9 px-3.5"
            >
              <X className="size-3.5 mr-1" />
              <span>Cancel</span>
            </Button>

            <Button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="rounded-xl bg-[#e8631b] hover:bg-[#d55513] text-white font-semibold text-xs h-9 px-4"
            >
              {isSaving ? (
                <>
                  <Loader2 className="size-3.5 mr-1.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check className="size-3.5 mr-1.5" />
                  <span>Save Info</span>
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {validationError && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700">
          {validationError}
        </div>
      )}

      {!isEditing ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3.5 rounded-2xl border border-[#f3e6de] bg-[#fffcf9] p-4">
              <div className="flex size-9 items-center justify-center rounded-xl bg-[#fef3ec] text-[#e8631b] shrink-0 mt-0.5">
                <UtensilsCrossed className="size-4.5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                  Cuisine Type
                </p>
                <p className="mt-1 text-base font-bold text-neutral-900">{displayCuisineType}</p>
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
                <p className="mt-1 text-base font-bold text-neutral-900">{displayAverageCost}</p>
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
              {displayDescription}
            </p>
          </div>
        </>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="cuisine-type-input"
                className="block text-xs font-bold text-neutral-700 mb-1"
              >
                Cuisine Type
              </label>
              <Input
                id="cuisine-type-input"
                type="text"
                value={cuisineType}
                onChange={(e) => setCuisineType(e.target.value)}
                placeholder="e.g. North Indian, Italian, Cafe"
                disabled={isSaving}
                className="rounded-xl border-[#eddcd4] focus-visible:ring-[#e8631b]"
              />
            </div>

            <div>
              <label
                htmlFor="average-cost-input"
                className="block text-xs font-bold text-neutral-700 mb-1"
              >
                Average Cost For Two (₹)
              </label>
              <Input
                id="average-cost-input"
                type="number"
                min="0"
                step="50"
                value={averageCost}
                onChange={(e) =>
                  setAverageCost(e.target.value === "" ? "" : Number(e.target.value))
                }
                placeholder="e.g. 600"
                disabled={isSaving}
                className="rounded-xl border-[#eddcd4] focus-visible:ring-[#e8631b]"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="about-restaurant-input"
              className="block text-xs font-bold text-neutral-700 mb-1"
            >
              About the Restaurant
            </label>
            <Textarea
              id="about-restaurant-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your restaurant, specialties, ambiance..."
              rows={4}
              disabled={isSaving}
              className="rounded-xl border-[#eddcd4] focus-visible:ring-[#e8631b] resize-y"
            />
          </div>
        </div>
      )}
    </div>
  );
}
