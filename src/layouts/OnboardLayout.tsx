import { LogOut } from "lucide-react";
import { Suspense } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { RESTAURANT_ROUTES } from "@/app/router/routes.constants";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { PageSkeleton } from "@/components/common/skeletons";
import { useRestaurantLogout } from "@/features/auth/hooks/useRestaurantLogout";
import OnboardSidebar from "@/features/onboard/components/Onboardsidebar";
import { useOnboardStore } from "@/features/onboard/store/onboard.store";

export default function OnboardLayout() {
  const location = useLocation();
  const { businessInformation, documents, location: locationData } = useOnboardStore();
  const { handleLogout, isLoading } = useRestaurantLogout();

  const isBusinessInfoComplete = Boolean(
    businessInformation?.restaurant_name &&
      businessInformation?.phone &&
      businessInformation?.owner_name,
  );

  const isDocumentsComplete = Boolean(
    isBusinessInfoComplete &&
      documents?.fssai?.documentKey &&
      documents?.businessRegistration?.documentKey &&
      documents?.ownerIdentity?.documentKey &&
      documents?.gst?.documentKey &&
      documents?.businessPan?.documentKey,
  );

  const isLocationComplete = Boolean(
    isDocumentsComplete &&
      locationData?.address_line1 &&
      locationData?.city &&
      locationData?.state &&
      locationData?.country &&
      locationData?.pincode,
  );

  const pathname = location.pathname;

  if (pathname.includes(RESTAURANT_ROUTES.ONBOARDING.DOCUMENTS) && !isBusinessInfoComplete) {
    return <Navigate to={RESTAURANT_ROUTES.ONBOARDING.BUSINESS_INFORMATION} replace />;
  }

  if (pathname.includes(RESTAURANT_ROUTES.ONBOARDING.LOCATION) && !isDocumentsComplete) {
    if (!isBusinessInfoComplete) {
      return <Navigate to={RESTAURANT_ROUTES.ONBOARDING.BUSINESS_INFORMATION} replace />;
    }
    return <Navigate to={RESTAURANT_ROUTES.ONBOARDING.DOCUMENTS} replace />;
  }

  if (pathname.includes(RESTAURANT_ROUTES.ONBOARDING.REVIEW) && !isLocationComplete) {
    if (!isBusinessInfoComplete) {
      return <Navigate to={RESTAURANT_ROUTES.ONBOARDING.BUSINESS_INFORMATION} replace />;
    }
    if (!isDocumentsComplete) {
      return <Navigate to={RESTAURANT_ROUTES.ONBOARDING.DOCUMENTS} replace />;
    }
    return <Navigate to={RESTAURANT_ROUTES.ONBOARDING.LOCATION} replace />;
  }

  return (
    <div className="min-h-screen bg-neutral-100">
      {/* Top navbar — branding and exit action */}
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
            description="Your progress is saved. You can log back in at any time to resume your application."
            confirmText="Exit & Log Out"
            confirmVariant="destructive"
            isLoading={isLoading}
            onConfirm={handleLogout}
          />
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-10 sm:px-10 lg:flex-row">
        <OnboardSidebar />

        <main className="flex-1">
          <Suspense fallback={<PageSkeleton />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
