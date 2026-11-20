import { LogOut } from "lucide-react";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { PageSkeleton } from "@/components/common/skeletons";
import { useRestaurantLogout } from "@/features/auth/hooks/useRestaurantLogout";

export default function VerificationStatusLayout() {
  const { handleLogout, isLoading } = useRestaurantLogout();

  return (
    <div className="min-h-screen bg-neutral-100">
      <header className="border-b border-neutral-200 bg-white">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-10">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500">
              <span className="text-sm font-bold text-white">S</span>
            </div>
            <span className="text-lg">
              <span className="font-bold text-neutral-900">SpotQ</span>{" "}
              <span className="text-neutral-500">for restaurants</span>
            </span>
          </div>

          <ConfirmDialog
            trigger={
              <button
                type="button"
                disabled={isLoading}
                aria-label="Exit Onboarding"
                className="inline-flex items-center gap-2 rounded-xl border border-neutral-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-neutral-700 shadow-2xs transition-colors hover:bg-neutral-50 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 disabled:opacity-60 cursor-pointer"
              >
                <LogOut className="size-3.5 text-neutral-500" />
                <span className="hidden sm:inline">Exit Onboarding</span>
                <span className="sm:hidden">Exit</span>
              </button>
            }
            title="Exit Onboarding"
            description="Your onboarding progress and application status are securely saved. You can log back in at any time to check status or continue."
            confirmText="Exit & Log Out"
            confirmVariant="destructive"
            isLoading={isLoading}
            onConfirm={handleLogout}
          />
        </div>
      </header>

      <div className="mx-auto flex max-w-4xl justify-center px-4 py-8 sm:px-6 sm:py-10">
        <Suspense fallback={<PageSkeleton />}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
}
