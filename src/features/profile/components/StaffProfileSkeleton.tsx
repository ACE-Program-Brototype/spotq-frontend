import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function StaffProfileSkeleton() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto w-full animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Overview Skeleton */}
        <div className="lg:col-span-4">
          <Card className="rounded-2xl border-[#eddcd4] bg-white p-6 shadow-xs flex flex-col items-center">
            <CardContent className="p-0 w-full flex flex-col items-center space-y-4 pt-2">
              {/* Avatar Skeleton */}
              <Skeleton className="size-28 sm:size-32 rounded-full bg-[#eddcd4]/60" />

              {/* Name & Email Skeleton */}
              <div className="space-y-2 w-full flex flex-col items-center">
                <Skeleton className="h-5 w-36 bg-[#eddcd4]/60" />
                <Skeleton className="h-3.5 w-48 bg-[#eddcd4]/40" />
              </div>

              {/* Badges Skeleton */}
              <div className="flex items-center gap-2 pt-1">
                <Skeleton className="h-6 w-20 rounded-md bg-[#eddcd4]/50" />
                <Skeleton className="h-6 w-16 rounded-md bg-[#eddcd4]/50" />
              </div>

              {/* Separator & Admin Note */}
              <div className="w-full pt-2">
                <div className="border-t border-[#eddcd4]/40 pt-4 flex items-center gap-2">
                  <Skeleton className="size-3.5 rounded-full bg-[#eddcd4]/40 shrink-0" />
                  <Skeleton className="h-3 w-56 bg-[#eddcd4]/40" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Personal Details Skeleton */}
        <div className="lg:col-span-8">
          <Card className="rounded-2xl border-[#eddcd4] bg-white p-6 sm:p-7 shadow-xs">
            <CardContent className="p-0 space-y-6">
              {/* Header Title Skeleton */}
              <div className="flex items-center gap-2.5">
                <Skeleton className="size-4.5 rounded bg-[#eddcd4]/60" />
                <Skeleton className="h-5 w-36 bg-[#eddcd4]/60" />
              </div>

              {/* 2x2 Grid: Full Name, Phone, Email, Staff Since */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-3.5 w-20 bg-[#eddcd4]/50" />
                  <Skeleton className="h-10 w-full rounded-xl bg-[#eddcd4]/50" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-3.5 w-24 bg-[#eddcd4]/50" />
                  <Skeleton className="h-10 w-full rounded-xl bg-[#eddcd4]/50" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-3.5 w-24 bg-[#eddcd4]/50" />
                  <Skeleton className="h-10 w-full rounded-xl bg-[#eddcd4]/50" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-3.5 w-24 bg-[#eddcd4]/50" />
                  <Skeleton className="h-10 w-full rounded-xl bg-[#eddcd4]/50" />
                </div>
              </div>

              {/* Footer Meta */}
              <div className="pt-3 border-t border-[#eddcd4]/40 flex items-center justify-between">
                <Skeleton className="h-3.5 w-28 bg-[#eddcd4]/40" />
                <Skeleton className="h-3.5 w-24 bg-[#eddcd4]/40" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
