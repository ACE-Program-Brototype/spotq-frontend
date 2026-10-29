import { Info, Upload } from "lucide-react";
import type { ChangeEvent, RefObject } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PROFILE_MESSAGES } from "../constants/profile.constants";
import type { StaffProfile } from "../types/profile.types";

export interface StaffProfileSidebarCardProps {
  profile: StaffProfile;
  initials: string;
  avatarDisplayUrl?: string | null;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onAvatarFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onAvatarButtonClick: () => void;
  isSaving: boolean;
  isStatusActive: boolean;
}

export function StaffProfileSidebarCard({
  profile,
  initials,
  avatarDisplayUrl,
  fileInputRef,
  onAvatarFileChange,
  onAvatarButtonClick,
  isSaving,
  isStatusActive,
}: StaffProfileSidebarCardProps) {
  return (
    <div className="lg:col-span-4 space-y-6">
      {/* Profile Photo Card */}
      <Card className="rounded-2xl border-[#eddcd4] bg-white shadow-xs">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-bold text-neutral-900">Profile Photo</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col items-center pt-2 pb-6 px-6 text-center space-y-4">
          <Avatar className="size-28 sm:size-32 rounded-full border-2 border-[#eddcd4] shadow-sm bg-[#faf7f5]">
            {avatarDisplayUrl ? (
              <AvatarImage
                src={avatarDisplayUrl}
                alt={profile.fullName}
                className="size-full object-cover rounded-full"
              />
            ) : null}
            <AvatarFallback className="bg-[#9a3412] text-white text-2xl sm:text-3xl font-bold flex items-center justify-center size-full">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-3 w-full">
            <p className="text-xs text-neutral-500 font-medium">JPG, GIF or PNG. Max size 2MB.</p>

            <input
              type="file"
              ref={fileInputRef}
              onChange={onAvatarFileChange}
              accept="image/jpeg,image/png,image/gif,image/webp"
              className="hidden"
              aria-label="Upload profile photo"
            />

            <Button
              type="button"
              variant="outline"
              onClick={onAvatarButtonClick}
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
                  isStatusActive ? "bg-emerald-500 ring-2 ring-emerald-500/20" : "bg-neutral-400"
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
  );
}
