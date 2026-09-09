import type { ProfileHeroCardProps } from "../types/profile.types";
import { formatDateOfBirth, getProfileInitials } from "../utils/profile.utils";

export function ProfileHeroCard({ profile }: ProfileHeroCardProps) {
  const displayName = profile.full_name?.trim() || "Customer";
  const initials = getProfileInitials(displayName);
  const formattedDob = formatDateOfBirth(profile.dob, null);

  return (
    <div className="relative flex flex-col sm:flex-row items-center sm:items-center gap-6 sm:gap-8 rounded-3xl bg-white p-6 sm:p-8 border border-neutral-200/80 shadow-xs">
      {/* Large Avatar */}
      <div className="relative shrink-0">
        <div className="flex size-28 sm:size-32 items-center justify-center rounded-full bg-[#fde1cb] text-[#3d2314] text-3xl sm:text-4xl font-black tracking-tight select-none ring-4 ring-[#fae4d4]">
          {initials}
        </div>
      </div>

      {/* Summary Info */}
      <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-2 sm:gap-2.5">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900">
          {displayName}
        </h2>

        {/* Location & DOB Chips */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
          {profile.location ? (
            <span className="inline-flex items-center rounded-full bg-[#fdf2e9] px-3.5 py-1 text-xs font-semibold text-[#5c3a21] border border-[#fae2ce]">
              {profile.location}
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full bg-neutral-100 px-3.5 py-1 text-xs font-medium text-neutral-500">
              Location not set
            </span>
          )}

          {formattedDob && (
            <span className="inline-flex items-center rounded-full bg-[#fdf2e9] px-3.5 py-1 text-xs font-semibold text-[#5c3a21] border border-[#fae2ce]">
              {formattedDob}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
