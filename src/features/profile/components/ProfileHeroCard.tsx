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
    <div className="relative flex flex-col sm:flex-row items-center sm:items-center gap-6 sm:gap-8 rounded-3xl bg-white p-6 sm:p-8 border border-neutral-200/80 shadow-xs">
      <div className="relative shrink-0">
        <div className="flex size-28 sm:size-32 items-center justify-center rounded-full bg-[#fde1cb] text-[#3d2314] text-3xl sm:text-4xl font-black tracking-tight select-none ring-4 ring-[#fae4d4]">
          {initials}
        </div>
      </div>

      <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-2 sm:gap-2.5">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900">
          {displayName}
        </h2>

        {memberSinceStr && (
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
            <span className="inline-flex items-center rounded-full bg-[#fdf2e9] px-3.5 py-1 text-xs font-semibold text-[#5c3a21] border border-[#fae2ce]">
              {memberSinceStr}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
