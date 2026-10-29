import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronRight, Loader2 } from "lucide-react";
import { type ChangeEvent, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { STAFF_ROUTES } from "@/app/router/routes.constants";
import { Button } from "@/components/ui/button";
import { usePresignedUrl } from "@/hooks/usePresignedUrl";
import { PROFILE_MESSAGES } from "../constants/profile.constants";
import {
  normalizeStaffPhone,
  type UpdateStaffProfileFormData,
  updateStaffProfileSchema,
  validateAvatarFile,
} from "../schemas/update-staff-profile.schema";
import { profileService } from "../services/profile.service";
import type { EditStaffProfileFormProps, UpdateStaffProfileDto } from "../types/profile.types";
import { getInitials } from "../utils/profile.utils";
import { StaffPersonalDetailsCard } from "./StaffPersonalDetailsCard";
import { StaffProfileSidebarCard } from "./StaffProfileSidebarCard";

export function EditStaffProfileForm({
  profile,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: EditStaffProfileFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const createdUrlRef = useRef<string | null>(null);
  const { data: presignedAvatarUrl } = usePresignedUrl(profile.avatarUrl);
  const [localAvatarPreview, setLocalAvatarPreview] = useState<string | null>(null);
  const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const avatarDisplayUrl = localAvatarPreview || presignedAvatarUrl;

  useEffect(() => {
    return () => {
      if (createdUrlRef.current && typeof URL.revokeObjectURL === "function") {
        URL.revokeObjectURL(createdUrlRef.current);
      }
    };
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm<UpdateStaffProfileFormData>({
    resolver: zodResolver(updateStaffProfileSchema),
    mode: "onChange",
    defaultValues: {
      name: profile.fullName || "",
      phone: profile.phone || "",
    },
  });

  const initials = getInitials(profile.fullName);
  const isStatusActive = profile.status.toLowerCase() === "active";

  const handleAvatarButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateAvatarFile(file);
    if (!validation.valid) {
      toast.error(validation.error || PROFILE_MESSAGES.AVATAR_INVALID_FILE);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    if (createdUrlRef.current && typeof URL.revokeObjectURL === "function") {
      URL.revokeObjectURL(createdUrlRef.current);
    }

    const objectUrl = URL.createObjectURL(file);
    createdUrlRef.current = objectUrl;
    setLocalAvatarPreview(objectUrl);
    setSelectedAvatarFile(file);
  };

  const onFormSubmit = async (data: UpdateStaffProfileFormData) => {
    let uploadedAvatarKey: string | null = null;

    if (selectedAvatarFile) {
      try {
        setIsUploadingAvatar(true);
        uploadedAvatarKey = await profileService.uploadStaffAvatar(
          profile.restaurantId,
          selectedAvatarFile,
          profile.id,
        );
      } catch {
        toast.error(PROFILE_MESSAGES.AVATAR_UPLOAD_FALLBACK_WARNING);
      } finally {
        setIsUploadingAvatar(false);
      }
    }

    const payload: UpdateStaffProfileDto = {
      name: data.name.trim(),
      phone: normalizeStaffPhone(data.phone),
    };

    if (uploadedAvatarKey) {
      payload.avatar_url = uploadedAvatarKey;
      payload.avatarUrl = uploadedAvatarKey;
      payload.hasAvatar = true;
    }

    await onSubmit(payload);
  };

  const isSaving = isSubmitting || isUploadingAvatar;
  const isSubmitDisabled = !isDirty && !selectedAvatarFile;

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Header section with Breadcrumb & Action buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <nav
            aria-label="Breadcrumbs"
            className="flex items-center gap-1.5 text-xs text-neutral-500 mb-1.5"
          >
            <Link
              to={STAFF_ROUTES.PROFILE.ROOT}
              className="hover:text-neutral-900 transition-colors"
            >
              Settings
            </Link>
            <ChevronRight className="size-3 text-neutral-400" />
            <span className="font-bold text-[#9a3412]">Staff Profile</span>
          </nav>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900">
            {PROFILE_MESSAGES.EDIT_STAFF_PROFILE_TITLE}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1 font-medium">
            {PROFILE_MESSAGES.EDIT_STAFF_PROFILE_SUBTITLE}
          </p>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSaving}
            className="h-10 px-5 rounded-xl border-[#eddcd4] bg-white text-neutral-700 font-bold text-sm hover:bg-neutral-50 transition-colors"
          >
            {PROFILE_MESSAGES.CANCEL}
          </Button>

          <Button
            type="submit"
            disabled={isSubmitDisabled || !isValid || isSaving}
            className="bg-[#9a3412] hover:bg-[#7c2d12] text-white rounded-xl px-5 h-10 text-sm font-bold shadow-sm transition-all inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>{PROFILE_MESSAGES.SAVING_CHANGES}</span>
              </>
            ) : (
              <span>{PROFILE_MESSAGES.SAVE_CHANGES}</span>
            )}
          </Button>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Profile Photo & Role/Status Cards */}
        <StaffProfileSidebarCard
          profile={profile}
          initials={initials}
          avatarDisplayUrl={avatarDisplayUrl}
          fileInputRef={fileInputRef}
          onAvatarFileChange={handleAvatarFileChange}
          onAvatarButtonClick={handleAvatarButtonClick}
          isSaving={isSaving}
          isStatusActive={isStatusActive}
        />

        {/* Right Column: Personal Details & Security/Access Cards */}
        <div className="lg:col-span-8 space-y-6">
          <StaffPersonalDetailsCard
            register={register}
            errors={errors}
            profile={profile}
            isSaving={isSaving}
          />
        </div>
      </div>
    </form>
  );
}

export default EditStaffProfileForm;
