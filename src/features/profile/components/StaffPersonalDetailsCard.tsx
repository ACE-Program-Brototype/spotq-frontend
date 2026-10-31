import { AlertCircle, Mail, User as UserIcon } from "lucide-react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PROFILE_MESSAGES } from "../constants/profile.constants";
import type { UpdateStaffProfileFormData } from "../schemas/update-staff-profile.schema";
import type { StaffProfile } from "../types/profile.types";

interface StaffPersonalDetailsCardProps {
  register: UseFormRegister<UpdateStaffProfileFormData>;
  errors: FieldErrors<UpdateStaffProfileFormData>;
  profile: StaffProfile;
  isSaving: boolean;
}

export function StaffPersonalDetailsCard({
  register,
  errors,
  profile,
  isSaving,
}: StaffPersonalDetailsCardProps) {
  return (
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
  );
}
