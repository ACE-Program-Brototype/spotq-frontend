import {
  Calendar,
  Info,
  Mail,
  User as UserIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { PROFILE_MESSAGES } from "../constants/profile.constants";
import type { StaffProfile } from "../types/profile.types";
import { formatDate, getInitials } from "../utils/profile.utils";

interface ProfileCardProps {
  profile: StaffProfile;
}

/**
 * Staff Profile Overview Card
 * Combines avatar, staff identification, role tag, status badge, and member since date into a clean identity card.
 */
export function StaffProfileOverviewCard({ profile }: ProfileCardProps) {
  const initials = getInitials(profile.fullName);
  const isStatusActive = profile.status.toLowerCase() === "active";
  const memberSince = formatDate(profile.createdAt);

  return (
    <Card className="rounded-2xl border-[#eddcd4] bg-white shadow-xs select-none">
      <CardContent className="flex flex-col items-center pt-8 pb-6 px-6 text-center space-y-4">
        <Avatar className="size-28 sm:size-32 rounded-full border-2 border-[#eddcd4] shadow-sm bg-[#faf7f5]">
          {profile.avatarUrl ? (
            <AvatarImage
              src={profile.avatarUrl}
              alt={profile.fullName}
              className="size-full object-cover rounded-full"
            />
          ) : null}
          <AvatarFallback className="bg-[#9a3412] text-white text-2xl sm:text-3xl font-bold flex items-center justify-center size-full">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="space-y-1">
          <h2 className="text-lg sm:text-xl font-bold text-neutral-900 leading-tight">
            {profile.fullName}
          </h2>
          <p className="text-xs text-neutral-500 font-medium">
            {profile.email}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          <Badge
            variant="outline"
            className="border-transparent bg-[#ffedd5] px-2.5 py-1 text-xs font-bold text-[#9a3412] uppercase tracking-wider rounded-md"
          >
            {profile.role}
          </Badge>

          <div className="inline-flex items-center gap-1.5 rounded-md border border-[#eddcd4] bg-neutral-50/80 px-2.5 py-1">
            <span
              className={`size-2 rounded-full ${
                isStatusActive ? "bg-emerald-500 ring-2 ring-emerald-500/20" : "bg-neutral-400"
              }`}
            />
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-800">
              {profile.status}
            </span>
          </div>
        </div>

        {profile.createdAt && (
          <div className="flex items-center justify-center gap-1.5 text-xs text-neutral-500 pt-0.5">
            <Calendar className="size-3.5 text-neutral-400 shrink-0" />
            <span>Staff since {memberSince}</span>
          </div>
        )}

        <Separator className="bg-[#eddcd4] !my-4" />

        <div className="flex items-start gap-2 text-neutral-500 text-left w-full">
          <Info className="size-4 text-neutral-400 shrink-0 mt-0.5" />
          <p className="text-xs italic text-neutral-500 leading-snug">
            {PROFILE_MESSAGES.ADMIN_ROLE_NOTICE}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// Keep backward-compatible alias
export const StaffProfilePhotoCard = StaffProfileOverviewCard;
export const StaffRoleStatusCard = StaffProfileOverviewCard;

/**
 * Personal Details Card
 * Displays Full Name, Phone Number, Email, and Member Since details cleanly.
 */
export function StaffPersonalDetailsCard({ profile }: ProfileCardProps) {
  const memberSince = formatDate(profile.createdAt);

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
          {/* Full Name */}
          <div className="space-y-1.5">
            <Label
              htmlFor="profile-full-name"
              className="text-xs font-semibold text-neutral-600"
            >
              Full Name
            </Label>
            <Input
              id="profile-full-name"
              type="text"
              readOnly
              value={profile.fullName}
              className="h-10 rounded-xl border-[#eddcd4] bg-neutral-50/60 px-3.5 text-sm font-medium text-neutral-900 cursor-default"
            />
          </div>

          {/* Phone Number */}
          <div className="space-y-1.5">
            <Label
              htmlFor="profile-phone"
              className="text-xs font-semibold text-neutral-600"
            >
              Phone Number
            </Label>
            <Input
              id="profile-phone"
              type="text"
              readOnly
              value={profile.phone || PROFILE_MESSAGES.NOT_PROVIDED}
              className={`h-10 rounded-xl border-[#eddcd4] bg-neutral-50/60 px-3.5 text-sm font-medium cursor-default ${
                profile.phone ? "text-neutral-900" : "text-neutral-400 italic"
              }`}
            />
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <Label
              htmlFor="profile-email"
              className="text-xs font-semibold text-neutral-600"
            >
              Email Address
            </Label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                <Mail className="size-4 text-neutral-400" />
              </div>
              <Input
                id="profile-email"
                type="email"
                readOnly
                value={profile.email}
                className="h-10 rounded-xl border-[#eddcd4] bg-neutral-50/60 pl-10 pr-3.5 text-sm font-medium text-neutral-900 cursor-default"
              />
            </div>
          </div>

          {/* Staff Since (Created At Date) */}
          <div className="space-y-1.5">
            <Label
              htmlFor="profile-staff-since"
              className="text-xs font-semibold text-neutral-600"
            >
              Staff Since
            </Label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                <Calendar className="size-4 text-neutral-400" />
              </div>
              <Input
                id="profile-staff-since"
                type="text"
                readOnly
                value={memberSince}
                className={`h-10 rounded-xl border-[#eddcd4] bg-neutral-50/60 pl-10 pr-3.5 text-sm font-medium cursor-default ${
                  profile.createdAt ? "text-neutral-900" : "text-neutral-400 italic"
                }`}
              />
            </div>
          </div>
        </div>

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
