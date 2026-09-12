import { Calendar, Clock, Hash, Mail, Phone, Shield, Store, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { StaffDetailCardsProps } from "@/features/staff/types/staff-detail.types";
import { formatStaffDate, getStaffInitials } from "@/features/staff/utils/staff.helpers";

/**
 * Staff Detail Profile Overview Card
 * Clean avatar, identity banner, role tag, status badge, and dates.
 */
export function StaffDetailOverviewCard({ staff }: StaffDetailCardsProps) {
  const initials = getStaffInitials(staff.fullName);
  const isActive = staff.status.toUpperCase() === "ACTIVE";
  const memberSince = formatStaffDate(staff.createdAt);

  return (
    <Card className="rounded-2xl border-[#eddcd4] bg-white shadow-2xs select-none">
      <CardContent className="flex flex-col items-center pt-8 pb-6 px-6 text-center space-y-4">
        <Avatar className="size-24 sm:size-28 rounded-full border-2 border-[#eddcd4] shadow-xs bg-[#faf7f5]">
          {staff.avatarUrl ? (
            <AvatarImage
              src={staff.avatarUrl}
              alt={staff.fullName}
              className="size-full object-cover rounded-full"
            />
          ) : null}
          <AvatarFallback className="bg-[#e8631b] text-white text-2xl font-bold flex items-center justify-center size-full">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="space-y-1">
          <h2 className="text-xl font-bold text-neutral-900 leading-tight">{staff.fullName}</h2>
          <p className="text-xs text-neutral-500 font-medium">{staff.email}</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          <Badge
            variant="outline"
            className="border-transparent bg-[#ffedd5] px-3 py-1 text-xs font-bold text-[#9a3412] uppercase tracking-wider rounded-md"
          >
            {staff.role}
          </Badge>

          <div
            className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-semibold ${
              isActive
                ? "border-emerald-200 bg-emerald-50/70 text-emerald-800"
                : "border-neutral-200 bg-neutral-100 text-neutral-600"
            }`}
          >
            <span
              className={`size-2 rounded-full ${
                isActive ? "bg-emerald-500 ring-2 ring-emerald-500/20" : "bg-neutral-400"
              }`}
            />
            <span className="uppercase tracking-wider font-bold text-[11px]">{staff.status}</span>
          </div>
        </div>

        {staff.createdAt && (
          <div className="flex items-center justify-center gap-1.5 text-xs text-neutral-500 pt-1">
            <Calendar className="size-3.5 text-neutral-400 shrink-0" />
            <span>Member since {memberSince}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Staff Detail Information Card
 * Detailed 2-column view of contact details, assignment info, timestamps, and identifiers.
 */
export function StaffDetailInfoCard({ staff }: StaffDetailCardsProps) {
  const memberSince = formatStaffDate(staff.createdAt);
  const lastUpdated = formatStaffDate(staff.updatedAt);

  return (
    <Card className="rounded-2xl border-[#eddcd4] bg-white shadow-2xs">
      <CardHeader className="pb-3 border-b border-[#eddcd4]/60">
        <CardTitle className="flex items-center gap-2 text-base font-bold text-neutral-900">
          <User className="size-4 text-neutral-700" />
          <span>Staff Information</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5 pt-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <Label htmlFor="staff-full-name" className="text-xs font-semibold text-neutral-600">
              Full Name
            </Label>
            <Input
              id="staff-full-name"
              type="text"
              readOnly
              value={staff.fullName}
              className="h-10 rounded-xl border-[#eddcd4] bg-neutral-50/60 px-3.5 text-sm font-medium text-neutral-900 cursor-default"
            />
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <Label htmlFor="staff-email" className="text-xs font-semibold text-neutral-600">
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
                value={staff.email}
                className="h-10 rounded-xl border-[#eddcd4] bg-neutral-50/60 pl-10 pr-3.5 text-sm font-medium text-neutral-900 cursor-default"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div className="space-y-1.5">
            <Label htmlFor="staff-phone" className="text-xs font-semibold text-neutral-600">
              Phone Number
            </Label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                <Phone className="size-4 text-neutral-400" />
              </div>
              <Input
                id="staff-phone"
                type="text"
                readOnly
                value={staff.phone || "Not provided"}
                className={`h-10 rounded-xl border-[#eddcd4] bg-neutral-50/60 pl-10 pr-3.5 text-sm font-medium cursor-default ${
                  staff.phone ? "text-neutral-900" : "text-neutral-400 italic"
                }`}
              />
            </div>
          </div>

          {/* Assigned Role */}
          <div className="space-y-1.5">
            <Label htmlFor="staff-role" className="text-xs font-semibold text-neutral-600">
              Role
            </Label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                <Shield className="size-4 text-neutral-400" />
              </div>
              <Input
                id="staff-role"
                type="text"
                readOnly
                value={staff.role}
                className="h-10 rounded-xl border-[#eddcd4] bg-neutral-50/60 pl-10 pr-3.5 text-sm font-medium text-neutral-900 cursor-default"
              />
            </div>
          </div>

          {/* Account Status */}
          <div className="space-y-1.5">
            <Label htmlFor="staff-status" className="text-xs font-semibold text-neutral-600">
              Account Status
            </Label>
            <Input
              id="staff-status"
              type="text"
              readOnly
              value={staff.status}
              className="h-10 rounded-xl border-[#eddcd4] bg-neutral-50/60 px-3.5 text-sm font-medium text-neutral-900 cursor-default"
            />
          </div>

          {/* Joined Date */}
          <div className="space-y-1.5">
            <Label htmlFor="staff-joined-date" className="text-xs font-semibold text-neutral-600">
              Created At
            </Label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                <Calendar className="size-4 text-neutral-400" />
              </div>
              <Input
                id="staff-joined-date"
                type="text"
                readOnly
                value={memberSince}
                className={`h-10 rounded-xl border-[#eddcd4] bg-neutral-50/60 pl-10 pr-3.5 text-sm font-medium cursor-default ${
                  staff.createdAt ? "text-neutral-900" : "text-neutral-400 italic"
                }`}
              />
            </div>
          </div>

          {/* Last Updated */}
          <div className="space-y-1.5">
            <Label htmlFor="staff-updated-date" className="text-xs font-semibold text-neutral-600">
              Last Updated
            </Label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                <Clock className="size-4 text-neutral-400" />
              </div>
              <Input
                id="staff-updated-date"
                type="text"
                readOnly
                value={lastUpdated}
                className={`h-10 rounded-xl border-[#eddcd4] bg-neutral-50/60 pl-10 pr-3.5 text-sm font-medium cursor-default ${
                  staff.updatedAt ? "text-neutral-900" : "text-neutral-400 italic"
                }`}
              />
            </div>
          </div>
        </div>

        {/* System Identifiers */}
        <Separator className="bg-[#eddcd4]/80 !my-4" />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-neutral-500 pt-1">
          <div className="flex items-center gap-2">
            <Hash className="size-3.5 text-neutral-400" />
            <span className="font-semibold text-neutral-600">Staff ID:</span>
            <span className="font-mono text-neutral-700 bg-neutral-100 border border-[#eddcd4]/80 px-2 py-0.5 rounded-md text-[11px]">
              {staff.id}
            </span>
          </div>

          {staff.restaurantId && (
            <div className="flex items-center gap-2">
              <Store className="size-3.5 text-neutral-400" />
              <span className="font-semibold text-neutral-600">Restaurant ID:</span>
              <span className="font-mono text-neutral-700 bg-neutral-100 border border-[#eddcd4]/80 px-2 py-0.5 rounded-md text-[11px]">
                {staff.restaurantId}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
