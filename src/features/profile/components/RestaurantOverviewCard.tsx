import { useEffect, useState } from "react";
import { toast } from "sonner";
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
import { resolveMediaUrl } from "../utils/profile.utils";
import { RestaurantOverviewActionButtons } from "./RestaurantOverviewActionButtons";
import { RestaurantOverviewCoverBanner } from "./RestaurantOverviewCoverBanner";
import { RestaurantOverviewDetailsView } from "./RestaurantOverviewDetailsView";
import { RestaurantOverviewEditFields } from "./RestaurantOverviewEditFields";
import { RestaurantOverviewLogoAvatar } from "./RestaurantOverviewLogoAvatar";

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
  const activeRestaurantId =
    restaurant?.id || fullData.restaurant?.id || user?.restaurantId || user?.id || "";

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

  useEffect(() => {
    if (!isEditing) {
      setName(restaurant.name || "");
      setPhone(restaurant.phone || "");
      setOwnerName(restaurant.ownerName || "");
      const resolvedLogo = resolveMediaUrl(profile.logo);
      const resolvedCover = resolveMediaUrl(profile.coverImage);
      setLogoSrc(resolvedLogo || FALLBACK_LOGO);
      setCoverSrc(resolvedCover || FALLBACK_COVER);
    }
  }, [
    restaurant.name,
    restaurant.phone,
    restaurant.ownerName,
    profile.logo,
    profile.coverImage,
    isEditing,
  ]);

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!activeRestaurantId) {
      toast.error("Restaurant session not found. Please log in again.");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setLogoSrc(previewUrl);

    try {
      const res = await upload(file, {
        entityType: "restaurants",
        entityId: activeRestaurantId,
        fileCategory: "PROFILE",
      });
      if (res?.s3ObjectKey) {
        setLogoKey(res.s3ObjectKey);
      } else {
        throw new Error("Upload did not return object key");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : PROFILE_MESSAGES.UPLOAD_FAILED;
      toast.error(message);
      setLogoKey(null);
      setLogoSrc(resolveMediaUrl(profile.logo) || FALLBACK_LOGO);
    }
  };

  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!activeRestaurantId) {
      toast.error("Restaurant session not found. Please log in again.");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setCoverSrc(previewUrl);

    try {
      const res = await upload(file, {
        entityType: "restaurants",
        entityId: activeRestaurantId,
        fileCategory: "IMAGES",
      });
      if (res?.s3ObjectKey) {
        setCoverImageKey(res.s3ObjectKey);
      } else {
        throw new Error("Upload did not return object key");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : PROFILE_MESSAGES.UPLOAD_FAILED;
      toast.error(message);
      setCoverImageKey(null);
      setCoverSrc(resolveMediaUrl(profile.coverImage) || FALLBACK_COVER);
    }
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
    setName(restaurant.name || "");
    setPhone(restaurant.phone || "");
    setOwnerName(restaurant.ownerName || "");
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
      settings: fullData.settings
        ? {
            acceptsQueue: fullData.settings.acceptsQueue,
            acceptsQrOrders: fullData.settings.acceptsQrOrders,
            loyaltyEnabled: fullData.settings.loyaltyEnabled,
            autoAcceptQueue: fullData.settings.autoAcceptQueue,
            seatingCapacity: fullData.settings.seatingCapacity ?? 0,
          }
        : undefined,
      businessHours: fullData.businessHours.map((bh) => ({
        dayOfWeek: bh.dayOfWeek,
        openTime: bh.openTime,
        closeTime: bh.closeTime,
        isClosed: bh.isClosed,
      })),
    };

    updateMutation.mutate(payload, {
      onSuccess: (updated) => {
        setIsEditing(false);
        setLogoKey(null);
        setCoverImageKey(null);
        if (updated?.profile?.logo) {
          setLogoSrc(resolveMediaUrl(updated.profile.logo) || FALLBACK_LOGO);
        }
        if (updated?.profile?.coverImage) {
          setCoverSrc(resolveMediaUrl(updated.profile.coverImage) || FALLBACK_COVER);
        }
      },
    });
  };

  const isSaving = updateMutation.isPending || isUploading;

  return (
    <div className="overflow-hidden rounded-3xl border border-[#eddcd4] bg-white shadow-2xs">
      <RestaurantOverviewCoverBanner
        coverSrc={coverSrc}
        name={name}
        isEditing={isEditing}
        isSaving={isSaving}
        isUploading={isUploading}
        onCoverChange={handleCoverChange}
        onCoverError={() => setCoverSrc(FALLBACK_COVER)}
      />

      <div className="relative px-6 pb-6 pt-0 sm:px-8 sm:pb-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-14 sm:-mt-16 mb-6">
          <RestaurantOverviewLogoAvatar
            logoSrc={logoSrc}
            name={name}
            isEditing={isEditing}
            isSaving={isSaving}
            isUploading={isUploading}
            onLogoChange={handleLogoChange}
            onLogoError={() => setLogoSrc(FALLBACK_LOGO)}
          />

          <RestaurantOverviewActionButtons
            isEditing={isEditing}
            isSaving={isSaving}
            onStartEdit={handleStartEdit}
            onCancel={handleCancel}
            onSave={handleSave}
          />
        </div>

        {validationError && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700">
            {validationError}
          </div>
        )}

        {!isEditing ? (
          <RestaurantOverviewDetailsView name={name} phone={phone} ownerName={ownerName} />
        ) : (
          <RestaurantOverviewEditFields
            name={name}
            phone={phone}
            ownerName={ownerName}
            isSaving={isSaving}
            onNameChange={setName}
            onPhoneChange={setPhone}
            onOwnerNameChange={setOwnerName}
          />
        )}
      </div>
    </div>
  );
}
