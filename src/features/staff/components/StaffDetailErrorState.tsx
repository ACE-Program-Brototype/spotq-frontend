import { AlertCircle, ArrowLeft, RefreshCw, ShieldAlert, UserX } from "lucide-react";
import { Link } from "react-router-dom";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { STAFF_MESSAGES } from "@/features/staff/constants/staff.constants";
import type { StaffDetailErrorStateProps } from "@/features/staff/types/staff-detail.types";
import { cn } from "@/lib/utils/cn";

export function StaffDetailErrorState({
  title,
  message,
  isNotFound = false,
  isForbidden = false,
  onRetry,
}: StaffDetailErrorStateProps) {
  if (isNotFound) {
    return (
      <div className="py-16 px-4 text-center max-w-lg mx-auto" role="alert">
        <Card className="rounded-2xl border-[#eddcd4] bg-white p-8 shadow-2xs">
          <CardContent className="flex flex-col items-center space-y-4 pt-4">
            <div className="size-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <UserX className="size-7" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-neutral-900">
                {title || STAFF_MESSAGES.STAFF_NOT_FOUND}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500">
                {message ||
                  "The staff member you are looking for does not exist or may have been removed."}
              </p>
            </div>
            <div className="pt-3">
              <Link
                to="/restaurant/staff"
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "rounded-xl bg-[#e8631b] hover:bg-[#d45614] text-white",
                )}
              >
                <ArrowLeft className="size-4 mr-2" />
                Back to Staff Members
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isForbidden) {
    return (
      <div className="py-16 px-4 text-center max-w-lg mx-auto" role="alert">
        <Card className="rounded-2xl border-[#eddcd4] bg-white p-8 shadow-2xs">
          <CardContent className="flex flex-col items-center space-y-4 pt-4">
            <div className="size-14 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
              <ShieldAlert className="size-7" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-neutral-900">{title || "Access Denied"}</h2>
              <p className="text-xs sm:text-sm text-neutral-500">
                {message || STAFF_MESSAGES.STAFF_FORBIDDEN}
              </p>
            </div>
            <div className="pt-3">
              <Link
                to="/restaurant/staff"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "rounded-xl border-[#eddcd4]",
                )}
              >
                <ArrowLeft className="size-4 mr-2" />
                Back to Staff Members
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="py-16 px-4 text-center max-w-lg mx-auto" role="alert">
      <Card className="rounded-2xl border-[#eddcd4] bg-white p-8 shadow-2xs">
        <CardContent className="flex flex-col items-center space-y-4 pt-4">
          <div className="size-14 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
            <AlertCircle className="size-7" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-neutral-900">
              {title || "Unable to Load Staff Details"}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500">
              {message || STAFF_MESSAGES.FETCH_STAFF_DETAIL_ERROR}
            </p>
          </div>
          <div className="pt-3 flex items-center gap-3">
            {onRetry && (
              <Button
                type="button"
                onClick={onRetry}
                className="rounded-xl bg-[#e8631b] hover:bg-[#d45614] text-white text-xs font-semibold"
              >
                <RefreshCw className="size-3.5 mr-2" />
                Retry
              </Button>
            )}
            <Link
              to="/restaurant/staff"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "rounded-xl border-[#eddcd4] text-xs font-semibold",
              )}
            >
              <ArrowLeft className="size-3.5 mr-1.5" />
              Back to Staff
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
