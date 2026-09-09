/**
 * EditProfileForm Component
 * Renders the customer profile edit form with pre-populated values,
 * single full name field mapping, read-only email/phone, date of birth, and gender.
 */

import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  Calendar,
  ChevronDown,
  Globe,
  Loader2,
  Lock,
  Mail,
  Phone,
  User as UserIcon,
} from "lucide-react";
import { useId } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Gender, PROFILE_MESSAGES } from "../constants/profile.constants";
import { type EditProfileFormData, editProfileSchema } from "../schemas/edit-profile.schema";
import type { CustomerProfile, UpdateCustomerProfileDto } from "../types/profile.types";

interface EditProfileFormProps {
  profile: CustomerProfile;
  onSubmit: (payload: UpdateCustomerProfileDto) => Promise<void> | void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function EditProfileForm({
  profile,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: EditProfileFormProps) {
  const fullNameId = useId();
  const emailId = useId();
  const phoneId = useId();
  const dobId = useId();
  const genderId = useId();

  const defaultDob = profile.dob ? new Date(profile.dob).toISOString().split("T")[0] : "";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      fullName: profile.full_name || "",
      email: profile.email || "",
      phone: profile.phone || "",
      dob: defaultDob,
      gender: profile.gender || "",
    },
  });

  const todayStr = new Date().toISOString().split("T")[0];

  const handleFormSubmit = (data: EditProfileFormData) => {
    const payload: UpdateCustomerProfileDto = {
      full_name: data.fullName.trim(),
      gender: (data.gender as Gender) || null,
      dob: data.dob || null,
    };

    onSubmit(payload);
  };

  const nameParts = (profile.full_name || "").trim().split(/\s+/).filter(Boolean);
  const initials =
    nameParts.length >= 2
      ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
      : nameParts.length === 1
        ? nameParts[0].slice(0, 2).toUpperCase()
        : "CU";

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="flex flex-col gap-8 rounded-3xl bg-white p-6 sm:p-8 md:p-10 border border-neutral-200/80 shadow-xs"
      noValidate
    >
      <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-neutral-100">
        <div className="relative">
          <div className="flex size-24 shrink-0 items-center justify-center rounded-full bg-[#fde1cb] text-[#4a2e18] text-2xl sm:text-3xl font-extrabold ring-4 ring-[#fdf2e9] shadow-xs select-none">
            {initials}
          </div>
        </div>
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-1">
          <h2 className="text-xl font-bold text-neutral-900">{profile.full_name}</h2>
          <p className="text-xs sm:text-sm font-medium text-neutral-500">{profile.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label
            htmlFor={fullNameId}
            className="text-xs font-bold uppercase tracking-wider text-neutral-600 flex items-center gap-1.5"
          >
            <UserIcon className="size-3.5 text-neutral-400" />
            <span>Full Name</span>
            <span className="text-red-500">*</span>
          </label>
          <input
            id={fullNameId}
            type="text"
            placeholder="e.g. John Doe"
            disabled={isSubmitting}
            {...register("fullName")}
            className="h-12 w-full rounded-2xl border border-[#f0e3d6] bg-[#fdf8f4] px-4 text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:border-[#ff6b00] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff6b00]/20 transition-all disabled:opacity-60"
          />
          {errors.fullName && (
            <p className="flex items-center gap-1 text-xs font-medium text-red-600 mt-0.5">
              <AlertCircle className="size-3.5 shrink-0" />
              <span>{errors.fullName.message}</span>
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor={emailId}
            className="text-xs font-bold uppercase tracking-wider text-neutral-600 flex items-center gap-1.5"
          >
            <Mail className="size-3.5 text-neutral-400" />
            <span>Email Address</span>
          </label>
          <div className="relative flex items-center">
            <input
              id={emailId}
              type="email"
              readOnly
              disabled
              value={profile.email}
              className="h-12 w-full rounded-2xl border border-neutral-200 bg-neutral-100/70 px-4 pr-11 text-sm font-medium text-neutral-600 cursor-not-allowed select-none"
            />
            <div className="absolute right-4 text-neutral-400">
              <Lock className="size-4" />
            </div>
          </div>
          <p className="text-[11px] font-medium text-neutral-400">
            {PROFILE_MESSAGES.EMAIL_IMMUTABLE_NOTE}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor={phoneId}
            className="text-xs font-bold uppercase tracking-wider text-neutral-600 flex items-center gap-1.5"
          >
            <Phone className="size-3.5 text-neutral-400" />
            <span>Phone Number</span>
          </label>
          <div className="relative flex items-center">
            <input
              id={phoneId}
              type="text"
              readOnly
              disabled
              value={profile.phone || PROFILE_MESSAGES.NOT_PROVIDED}
              className="h-12 w-full rounded-2xl border border-neutral-200 bg-neutral-100/70 px-4 pr-11 text-sm font-medium text-neutral-600 cursor-not-allowed select-none"
            />
            <div className="absolute right-4 text-neutral-400">
              <Lock className="size-4" />
            </div>
          </div>
          <p className="text-[11px] font-medium text-neutral-400">
            {PROFILE_MESSAGES.PHONE_VERIFIED_NOTE}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor={dobId}
            className="text-xs font-bold uppercase tracking-wider text-neutral-600 flex items-center gap-1.5"
          >
            <Calendar className="size-3.5 text-neutral-400" />
            <span>Date of Birth</span>
          </label>
          <input
            id={dobId}
            type="date"
            max={todayStr}
            disabled={isSubmitting}
            {...register("dob")}
            className="h-12 w-full rounded-2xl border border-[#f0e3d6] bg-[#fdf8f4] px-4 text-sm font-medium text-neutral-900 focus:border-[#ff6b00] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff6b00]/20 transition-all disabled:opacity-60"
          />
          {errors.dob && (
            <p className="flex items-center gap-1 text-xs font-medium text-red-600 mt-0.5">
              <AlertCircle className="size-3.5 shrink-0" />
              <span>{errors.dob.message}</span>
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 md:col-span-2">
          <label
            htmlFor={genderId}
            className="text-xs font-bold uppercase tracking-wider text-neutral-600 flex items-center gap-1.5"
          >
            <Globe className="size-3.5 text-neutral-400" />
            <span>Gender</span>
          </label>
          <div className="relative flex items-center">
            <select
              id={genderId}
              disabled={isSubmitting}
              {...register("gender")}
              className="h-12 w-full appearance-none rounded-2xl border border-[#f0e3d6] bg-[#fdf8f4] px-4 pr-10 text-sm font-medium text-neutral-900 focus:border-[#ff6b00] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff6b00]/20 transition-all disabled:opacity-60 cursor-pointer"
            >
              <option value="">Select Gender</option>
              <option value={Gender.FEMALE}>Female</option>
              <option value={Gender.MALE}>Male</option>
              <option value={Gender.OTHER}>Other</option>
            </select>
            <div className="pointer-events-none absolute right-4 text-neutral-500">
              <ChevronDown className="size-4" />
            </div>
          </div>
          {errors.gender && (
            <p className="flex items-center gap-1 text-xs font-medium text-red-600 mt-0.5">
              <AlertCircle className="size-3.5 shrink-0" />
              <span>{errors.gender.message}</span>
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-6 border-t border-neutral-100">
        <Button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="w-full sm:w-auto h-12 rounded-2xl bg-[#fdf2e9] hover:bg-[#fae4d3] text-[#ff6b00] font-bold px-7 text-sm transition-all active:scale-98 shadow-none"
        >
          {PROFILE_MESSAGES.CANCEL}
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto h-12 rounded-2xl bg-[#ff6b00] hover:bg-[#e86100] text-white font-bold px-8 text-sm transition-all active:scale-98 shadow-xs gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>{PROFILE_MESSAGES.SAVING_CHANGES}</span>
            </>
          ) : (
            <span>{PROFILE_MESSAGES.SAVE_CHANGES}</span>
          )}
        </Button>
      </div>
    </form>
  );
}
