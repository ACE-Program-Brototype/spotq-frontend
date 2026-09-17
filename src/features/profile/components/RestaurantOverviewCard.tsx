import { Building2, Camera, Check, Edit3, Loader2, Phone, Upload, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { useFileUpload } from "@/hooks/useFileUpload";
import { PROFILE_MESSAGES } from "../constants/profile.constants";
import { useUpdateRestaurantProfile } from "../hooks/use-update-restaurant-profile";
import type {
  RestaurantOverviewDetails,
  RestaurantProfileData,
  RestaurantProfileDetails,
  UpdateRestaurantProfilePayload,
} from "../types/restaurant-profile.types";
import { cacheLocalMedia, resolveMediaUrl } from "../utils/profile.utils";

interface RestaurantOverviewCardProps {
  restaurant: RestaurantOverviewDetails;
  profile: RestaurantProfileDetails;
  fullData: RestaurantProfileData;
}

const FALLBACK_COVER =
  "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='400' viewBox='0 0 1200 400'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%231c1917'/%3E%3Cstop offset='50%25' stop-color='%2344403c'/%3E%3Cstop offset='100%25' stop-color='%231c1917'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23g)'/%3E%3Ccircle cx='600' cy='200' r='120' fill='%23e8631b' opacity='0.15'/%3E%3Cpath d='M600 130 L640 250 L560 250 Z' fill='%23e8631b' opacity='0.2'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23e7e5e4' font-family='sans-serif' font-size='28' font-weight='bold' opacity='0.4'%3ESpotQ Restaurant Cover%3C/text%3E%3C/svg%3E";

const FALLBACK_LOGO =
  "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='100%25' height='100%25' rx='32' fill='%23fef3ec'/%3E%3Crect x='8' y='8' width='184' height='184' rx='28' fill='none' stroke='%23fae2d3' stroke-width='4'/%3E%3Cpath d='M60 140 L100 60 L140 140 Z' fill='%23e8631b'/%3E%3Ccircle cx='100' cy='115' r='18' fill='%23ffffff'/%3E%3C/svg%3E";

export function RestaurantOverviewCard({
  restaurant,
  profile,
  fullData,
}: RestaurantOverviewCardProps) {
  const user = useAuthStore((state) => state.user);
  const activeRestaurantId = user?.restaurantId || user?.id || "profile";

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(restaurant.name || "");
  const [phone, setPhone] = useState(restaurant.phone || "");
  const [ownerName, setOwnerName] = useState(restaurant.ownerName || "");

  const [logoKey, setLogoKey] = useState<string | null>(null);
  const [coverImageKey, setCoverImageKey] = useState<string | null>(null);

  const initialLogo = resolveMediaUrl(profile.logo);
  const initialCover = resolveMediaUrl(profile.coverImage);

  const [validationError, setValidationError] = useState<string | null>(null);

  const { upload, isUploading } = useFileUpload();
  const updateMutation = useUpdateRestaurantProfile();

  const [coverSrc, setCoverSrc] = useState<string>(initialCover || FALLBACK_COVER);
  const [logoSrc, setLogoSrc] = useState<string>(initialLogo || FALLBACK_LOGO);

  // Sync image sources when profile props change (and not actively editing with unsaved local images)
  useEffect(() => {
    if (!isEditing) {
      const resolvedLogo = resolveMediaUrl(profile.logo);
      const resolvedCover = resolveMediaUrl(profile.coverImage);
      setLogoSrc(resolvedLogo || FALLBACK_LOGO);
      setCoverSrc(resolvedCover || FALLBACK_COVER);
    }
  }, [profile.logo, profile.coverImage, isEditing]);

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Immediately show local object URL preview for responsive user feedback
    const previewUrl = URL.createObjectURL(file);
    setLogoSrc(previewUrl);

    // Read file as Data URL to store in local media cache once uploaded
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;

      try {
        const res = await upload(file, {
          entityType: "restaurant",
          entityId: activeRestaurantId,
          fileCategory: "PROFILE",
        });
        if (res?.s3ObjectKey) {
          setLogoKey(res.s3ObjectKey);
          cacheLocalMedia(res.s3ObjectKey, dataUrl);
        } else {
          throw new Error("Upload did not return object key");
        }
      } catch {
        toast.error(PROFILE_MESSAGES.UPLOAD_FAILED);
        setLogoKey(null);
        setLogoSrc(resolveMediaUrl(profile.logo) || FALLBACK_LOGO);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Immediately show local object URL preview for responsive user feedback
    const previewUrl = URL.createObjectURL(file);
    setCoverSrc(previewUrl);

    // Read file as Data URL to store in local media cache once uploaded
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;

      try {
        const res = await upload(file, {
          entityType: "restaurant",
          entityId: activeRestaurantId,
          fileCategory: "PROFILE",
        });
        if (res?.s3ObjectKey) {
          setCoverImageKey(res.s3ObjectKey);
          cacheLocalMedia(res.s3ObjectKey, dataUrl);
        } else {
          throw new Error("Upload did not return object key");
        }
      } catch {
        toast.error(PROFILE_MESSAGES.UPLOAD_FAILED);
        setCoverImageKey(null);
        setCoverSrc(resolveMediaUrl(profile.coverImage) || FALLBACK_COVER);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleStartEdit = () => {
    setName(restaurant.name || "");
    setPhone(restaurant.phone || "");
    setOwnerName(restaurant.ownerName || "");
    setLogoKey(null);
    setCoverImageKey(null);
    const resolvedLogo = resolveMediaUrl(profile.logo);
    const resolvedCover = resolveMediaUrl(profile.coverImage);
    setLogoSrc(resolvedLogo || FALLBACK_LOGO);
    setCoverSrc(resolvedCover || FALLBACK_COVER);
    setValidationError(null);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setValidationError(null);
    setLogoKey(null);
    setCoverImageKey(null);
    const resolvedLogo = resolveMediaUrl(profile.logo);
    const resolvedCover = resolveMediaUrl(profile.coverImage);
    setLogoSrc(resolvedLogo || FALLBACK_LOGO);
    setCoverSrc(resolvedCover || FALLBACK_COVER);
  };

  const handleSave = () => {
    if (!name.trim()) {
      setValidationError(PROFILE_MESSAGES.VALIDATION.RESTAURANT_NAME_REQUIRED);
      return;
    }
    if (!phone.trim()) {
      setValidationError(PROFILE_MESSAGES.VALIDATION.PHONE_REQUIRED);
      return;
    }
    if (!ownerName.trim()) {
      setValidationError(PROFILE_MESSAGES.VALIDATION.OWNER_NAME_REQUIRED);
      return;
    }
    setValidationError(null);

    const payload: UpdateRestaurantProfilePayload = {
      restaurant: {
        name: name.trim(),
        phone: phone.trim(),
        ownerName: ownerName.trim(),
      },
      profile: {
        description: fullData.profile.description,
        cuisineType: fullData.profile.cuisineType,
        averageCost: fullData.profile.averageCost,
        ...(logoKey ? { logoKey } : {}),
        ...(coverImageKey ? { coverImageKey } : {}),
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

  const isSaving = updateMutation.isPending || isUploading;

  return (
    <div className="overflow-hidden rounded-3xl border border-[#eddcd4] bg-white shadow-2xs">
      {/* Cover Image Banner */}
      <div className="relative h-44 sm:h-56 w-full bg-neutral-900 overflow-hidden">
        <img
          src={coverSrc}
          alt={`${name} Cover`}
          onError={() => setCoverSrc(FALLBACK_COVER)}
          className="h-full w-full object-cover transition-opacity duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {isEditing && (
          <label className="absolute top-4 right-4 cursor-pointer inline-flex items-center gap-2 bg-black/70 hover:bg-black/80 text-white text-xs font-semibold px-3 py-2 rounded-xl backdrop-blur-xs transition-all shadow-md">
            {isUploading ? (
              <Loader2 className="size-3.5 animate-spin text-white" />
            ) : (
              <Upload className="size-3.5" />
            )}
            <span>{isUploading ? "Uploading..." : "Change Cover"}</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverChange}
              disabled={isSaving}
              className="hidden"
            />
          </label>
        )}
      </div>

      {/* Main Details Section */}
      <div className="relative px-6 pb-6 pt-0 sm:px-8 sm:pb-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-14 sm:-mt-16 mb-6">
          {/* Logo Avatar */}
          <div className="relative size-24 sm:size-28 rounded-2xl border-4 border-white bg-white shadow-md overflow-hidden shrink-0 group">
            <img
              src={logoSrc}
              alt={`${name} Logo`}
              onError={() => setLogoSrc(FALLBACK_LOGO)}
              className="h-full w-full object-cover"
            />

            {isEditing && (
              <label className="absolute inset-0 bg-black/50 hover:bg-black/60 flex flex-col items-center justify-center text-white cursor-pointer transition-all">
                {isUploading ? (
                  <>
                    <Loader2 className="size-6 mb-1 animate-spin" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      Uploading
                    </span>
                  </>
                ) : (
                  <>
                    <Camera className="size-6 mb-1" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      Change Logo
                    </span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  disabled={isSaving}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Action Buttons */}
          {!isEditing ? (
            <Button
              type="button"
              variant="outline"
              onClick={handleStartEdit}
              className="rounded-xl border-[#eddcd4] bg-[#faf7f5] text-neutral-800 hover:bg-[#f3e6de] font-semibold text-xs h-9 px-4 self-start sm:self-auto cursor-pointer"
            >
              <Edit3 className="size-3.5 mr-1.5 text-[#e8631b]" />
              <span>Edit Overview</span>
            </Button>
          ) : (
            <div className="flex items-center gap-2 self-start sm:self-auto">
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
                    <span>Save Overview</span>
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        {validationError && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700">
            {validationError}
          </div>
        )}

        {/* Info Section */}
        {!isEditing ? (
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
        ) : (
          <div className="space-y-4">
            <div>
              <label
                htmlFor="restaurant-name-input"
                className="block text-xs font-bold text-neutral-700 mb-1"
              >
                Restaurant Name
              </label>
              <Input
                id="restaurant-name-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter restaurant name"
                disabled={isSaving}
                className="rounded-xl border-[#eddcd4] focus-visible:ring-[#e8631b]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="contact-phone-input"
                  className="block text-xs font-bold text-neutral-700 mb-1"
                >
                  Contact Phone
                </label>
                <Input
                  id="contact-phone-input"
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter contact phone"
                  disabled={isSaving}
                  className="rounded-xl border-[#eddcd4] focus-visible:ring-[#e8631b]"
                />
              </div>

              <div>
                <label
                  htmlFor="owner-name-input"
                  className="block text-xs font-bold text-neutral-700 mb-1"
                >
                  Owner Name
                </label>
                <Input
                  id="owner-name-input"
                  type="text"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="Enter owner name"
                  disabled={isSaving}
                  className="rounded-xl border-[#eddcd4] focus-visible:ring-[#e8631b]"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
