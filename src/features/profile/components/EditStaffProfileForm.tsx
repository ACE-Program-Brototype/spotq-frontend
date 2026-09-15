import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  ChevronRight,
  Info,
  Loader2,
  Mail,
  Upload,
  User as UserIcon,
} from "lucide-react";
import { type ChangeEvent, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
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

export function EditStaffProfileForm({
  profile,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: EditStaffProfileFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(profile.avatarUrl);
  const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

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
      return;
    }

    setSelectedAvatarFile(file);
    const objectUrl = URL.createObjectURL(file);
    setAvatarPreview(objectUrl);
  };

  const handleFormSubmit = async (data: UpdateStaffProfileFormData) => {
    let uploadedAvatarKey: string | null = null;

    if (selectedAvatarFile) {
      try {
        setIsUploadingAvatar(true);
        uploadedAvatarKey = await profileService.uploadStaffAvatar(
          profile.restaurantId,
          selectedAvatarFile,
        );
      } catch (uploadErr) {
        console.warn("Avatar upload failed or storage offline:", uploadErr);
        toast.error("Failed to upload avatar image. Proceeding with name and phone update.");
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
    }

    await onSubmit(payload);
  };

  const isSaving = isSubmitting || isUploadingAvatar;
  const hasChanges = isDirty || selectedAvatarFile !== null;
  const isSubmitDisabled = !hasChanges || !isValid || isSaving;

  return (
    <form
      id="staff-profile-edit-form"
      onSubmit={handleSubmit(handleFormSubmit)}
      noValidate
      className="space-y-6 max-w-6xl mx-auto w-full pb-10"
    >
      {/* Header section with Breadcrumb & Action buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          {/* Breadcrumb Navigation matching Figma */}
          <nav
            aria-label="Breadcrumbs"
            className="flex items-center gap-1.5 text-xs text-neutral-500 mb-1.5"
          >
            <Link to="/staff/profile" className="hover:text-neutral-900 transition-colors">
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

        {/* Action Buttons: Cancel and Save Changes */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSaving}
            className="h-10 px-5 rounded-xl border-[#eddcd4] bg-white text-neutral-700 font-bold text-sm hover:bg-neutral-50 transition-colors"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={isSubmitDisabled}
            className="bg-[#9a3412] hover:bg-[#7c2d12] text-white rounded-xl px-5 h-10 text-sm font-bold shadow-sm transition-all inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>{PROFILE_MESSAGES.SAVING_CHANGES}</span>
              </>
            ) : (
              <span>Save Changes</span>
            )}
          </Button>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Profile Photo & Role/Status Cards */}
        <div className="lg:col-span-4 space-y-6">
          {/* Profile Photo Card */}
          <Card className="rounded-2xl border-[#eddcd4] bg-white shadow-xs">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold text-neutral-900">Profile Photo</CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col items-center pt-2 pb-6 px-6 text-center space-y-4">
              <Avatar className="size-28 sm:size-32 rounded-full border-2 border-[#eddcd4] shadow-sm bg-[#faf7f5]">
                {avatarPreview ? (
                  <AvatarImage
                    src={avatarPreview}
                    alt={profile.fullName}
                    className="size-full object-cover rounded-full"
                  />
                ) : null}
                <AvatarFallback className="bg-[#9a3412] text-white text-2xl sm:text-3xl font-bold flex items-center justify-center size-full">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-3 w-full">
                <p className="text-xs text-neutral-500 font-medium">
                  JPG, GIF or PNG. Max size 2MB.
                </p>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarFileChange}
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  className="hidden"
                  aria-label="Upload profile photo"
                />

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAvatarButtonClick}
                  disabled={isSaving}
                  className="w-full rounded-xl border-[#eddcd4] text-neutral-800 font-bold text-xs h-9 hover:bg-[#eddcd4]/30 transition-colors inline-flex items-center justify-center gap-2"
                >
                  <Upload className="size-3.5 text-neutral-600" />
                  <span>Upload New Photo</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Role & Status Card */}
          <Card className="rounded-2xl border-[#eddcd4] bg-white shadow-xs">
            <CardContent className="pt-6 pb-6 px-6 space-y-4">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-neutral-500 uppercase tracking-wider text-[11px]">
                  Current Role
                </span>
                <Badge
                  variant="outline"
                  className="border-transparent bg-[#ffedd5] px-2.5 py-1 text-xs font-bold text-[#9a3412] uppercase tracking-wider rounded-md"
                >
                  {profile.role}
                </Badge>
              </div>

              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-neutral-500 uppercase tracking-wider text-[11px]">
                  Account Status
                </span>
                <div className="inline-flex items-center gap-1.5 rounded-md border border-[#eddcd4] bg-neutral-50/80 px-2.5 py-1">
                  <span
                    className={`size-2 rounded-full ${
                      isStatusActive
                        ? "bg-emerald-500 ring-2 ring-emerald-500/20"
                        : "bg-neutral-400"
                    }`}
                  />
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                    {profile.status}
                  </span>
                </div>
              </div>

              <Separator className="bg-[#eddcd4] !my-3" />

              <div className="flex items-start gap-2 text-neutral-500 text-left w-full">
                <Info className="size-4 text-neutral-400 shrink-0 mt-0.5" />
                <p className="text-xs italic text-neutral-500 leading-snug">
                  {PROFILE_MESSAGES.ADMIN_ROLE_NOTICE}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Personal Details & Security/Access Cards */}
        <div className="lg:col-span-8 space-y-6">
          {/* Personal Details Card */}
          <Card className="rounded-2xl border-[#eddcd4] bg-white shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg font-bold text-neutral-900">
                <UserIcon className="size-4.5 text-neutral-700" />
                <span>Personal Details</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-5 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name Field (Editable) */}
                <div className="space-y-1.5">
                  <Label htmlFor="staff-name" className="text-xs font-semibold text-neutral-700">
                    Full Name <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="staff-name"
                    type="text"
                    placeholder="Enter full name"
                    disabled={isSaving}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "staff-name-error" : undefined}
                    className={`h-10 rounded-xl border-[#eddcd4] bg-white px-3.5 text-sm font-medium text-neutral-900 focus:border-[#9a3412] focus:ring-1 focus:ring-[#9a3412] ${
                      errors.name ? "border-rose-400 ring-1 ring-rose-400" : ""
                    }`}
                    {...register("name")}
                  />
                  {errors.name && (
                    <p
                      id="staff-name-error"
                      role="alert"
                      className="text-[11px] font-medium text-rose-600 flex items-center gap-1 mt-1"
                    >
                      <AlertCircle className="size-3 shrink-0" />
                      <span>{errors.name.message}</span>
                    </p>
                  )}
                </div>

                {/* Phone Number Field (Editable) */}
                <div className="space-y-1.5">
                  <Label htmlFor="staff-phone" className="text-xs font-semibold text-neutral-700">
                    Phone Number <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="staff-phone"
                    type="tel"
                    placeholder="+91 9876543210"
                    disabled={isSaving}
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? "staff-phone-error" : undefined}
                    className={`h-10 rounded-xl border-[#eddcd4] bg-white px-3.5 text-sm font-medium text-neutral-900 focus:border-[#9a3412] focus:ring-1 focus:ring-[#9a3412] ${
                      errors.phone ? "border-rose-400 ring-1 ring-rose-400" : ""
                    }`}
                    {...register("phone")}
                  />
                  {errors.phone && (
                    <p
                      id="staff-phone-error"
                      role="alert"
                      className="text-[11px] font-medium text-rose-600 flex items-center gap-1 mt-1"
                    >
                      <AlertCircle className="size-3 shrink-0" />
                      <span>{errors.phone.message}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Email Address Field (Read-only) */}
              <div className="space-y-1.5">
                <Label htmlFor="staff-email" className="text-xs font-semibold text-neutral-700">
                  Email Address
                </Label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                    <Mail className="size-4 text-neutral-400" />
                  </div>
                  <Input
                    id="staff-email"
                    type="email"
                    readOnly
                    value={profile.email}
                    className="h-10 rounded-xl border-[#eddcd4] bg-neutral-50/70 pl-10 pr-3.5 text-sm font-medium text-neutral-700 cursor-not-allowed select-none"
                  />
                </div>
                <p className="text-[11px] text-neutral-500 font-medium">
                  {PROFILE_MESSAGES.PRIMARY_EMAIL_HINT}
                </p>
              </div>

              {/* Read-Only System Details (Staff ID & Restaurant ID) */}
              {(profile.id || profile.restaurantId) && (
                <div className="pt-3 border-t border-[#eddcd4] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 text-xs text-neutral-500">
                  {profile.id && (
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-neutral-600">Staff ID:</span>
                      <span className="font-mono text-neutral-600 bg-neutral-100 border border-[#eddcd4]/60 px-2 py-0.5 rounded-md text-[11px]">
                        {profile.id}
                      </span>
                    </div>
                  )}
                  {profile.restaurantId && (
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-neutral-600">Restaurant ID:</span>
                      <span className="font-mono text-neutral-600 bg-neutral-100 border border-[#eddcd4]/60 px-2 py-0.5 rounded-md text-[11px]">
                        {profile.restaurantId}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
