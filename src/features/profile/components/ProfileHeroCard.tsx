/**
 * ProfileHeroCard Component
 * Displays the top summary card for customer profile with 2-letter initials avatar,
 * full name, and Member Since badge.
 */

import { MONTH_NAMES, PROFILE_MESSAGES } from "../constants/profile.constants";
import type { ProfileHeroCardProps } from "../types/profile.types";

export function ProfileHeroCard({ profile }: ProfileHeroCardProps) {
  const displayName = profile.full_name?.trim() || "Customer";
  const nameParts = displayName.split(/\s+/).filter(Boolean);
  const initials =
    nameParts.length >= 2
      ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
      : nameParts.length === 1
        ? nameParts[0].slice(0, 2).toUpperCase()
        : "CU";

  const memberSinceStr = profile.created_at
    ? (() => {
        try {
          const date = new Date(profile.created_at);
          if (Number.isNaN(date.getTime())) return null;
          const day = date.getUTCDate();
          const month = MONTH_NAMES[date.getUTCMonth()];
          const year = date.getUTCFullYear();
          return `${PROFILE_MESSAGES.MEMBER_SINCE} ${day} ${month} ${year}`;
        } catch {
          return null;
        }
      })()
    : null;

  return (
    <div className="relative flex flex-row items-center gap-4 sm:gap-8 rounded-2xl sm:rounded-3xl bg-white p-4 sm:p-8 border border-neutral-200/80 shadow-xs">
      <div className="relative shrink-0">
        <div className="flex size-16 sm:size-28 lg:size-32 items-center justify-center rounded-full bg-[#fde1cb] text-[#3d2314] text-xl sm:text-3xl lg:text-4xl font-black tracking-tight select-none ring-2 sm:ring-4 ring-[#fae4d4]">
          {initials}
        </div>
      </div>

      <div className="flex flex-col items-start text-left gap-1 sm:gap-2.5 min-w-0">
        <h2 className="text-lg sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-neutral-900 truncate">
          {displayName}
        </h2>

        {memberSinceStr && (
          <div className="flex flex-wrap items-center justify-start gap-2 pt-0.5 sm:pt-1">
            <span className="inline-flex items-center rounded-full bg-[#fdf2e9] px-2.5 py-0.5 sm:px-3.5 sm:py-1 text-[10px] sm:text-xs font-semibold text-[#5c3a21] border border-[#fae2ce]">
              {memberSinceStr}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
