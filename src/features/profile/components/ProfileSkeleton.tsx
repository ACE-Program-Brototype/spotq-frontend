/**
 * ProfileSkeleton Component
 * Animated skeleton placeholder for customer profile view and edit loading states.
 */

import { Skeleton } from "@/components/ui/skeleton";
import { PROFILE_MESSAGES } from "../constants/profile.constants";

const skeletonCardKeys = ["sk-email", "sk-phone", "sk-gender", "sk-dob"];

export function ProfileSkeleton() {
  return (
    <div
      role="status"
      className="flex flex-col gap-6 w-full animate-pulse"
      aria-label={PROFILE_MESSAGES.LOADING_PROFILE}
    >
      <div className="flex flex-row items-center gap-4 sm:gap-8 rounded-2xl sm:rounded-3xl bg-card p-4 sm:p-8 border border-border/60 shadow-xs">
        <Skeleton className="size-16 sm:size-28 lg:size-32 rounded-full bg-muted/70 shrink-0" />
        <div className="flex flex-col items-start gap-2 sm:gap-3 w-full max-w-sm min-w-0">
          <Skeleton className="h-6 sm:h-8 w-36 sm:w-48 rounded-lg bg-muted/80" />
          <Skeleton className="h-3.5 sm:h-4 w-28 sm:w-32 rounded-md bg-muted/60" />
          <div className="flex gap-2 pt-0.5 sm:pt-1">
            <Skeleton className="h-5 sm:h-6 w-20 sm:w-24 rounded-full bg-muted/60" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2.5 sm:gap-4">
        {skeletonCardKeys.map((key) => (
          <div
            key={key}
            className="flex items-center gap-3 sm:gap-4 rounded-xl sm:rounded-2xl bg-card p-3 sm:p-5 border border-border/60 shadow-xs"
          >
            <Skeleton className="size-9 sm:size-11 rounded-lg sm:rounded-xl bg-muted/70 shrink-0" />
            <div className="flex flex-col gap-1 w-full min-w-0">
              <Skeleton className="h-2.5 sm:h-3 w-14 sm:w-16 rounded-xs bg-muted/50" />
              <Skeleton className="h-3.5 sm:h-4 w-24 sm:w-28 rounded-sm bg-muted/70" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
