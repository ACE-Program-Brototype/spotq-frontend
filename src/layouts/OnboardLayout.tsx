import { Navigate, Outlet, useLocation } from "react-router-dom";
import OnboardSidebar from "@/features/onboard/components/Onboardsidebar";
import { useOnboardStore } from "@/features/onboard/store/onboard.store";

export default function OnboardLayout() {
  const location = useLocation();
  const { businessInformation, documents, location: locationData } = useOnboardStore();

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

  if (pathname.includes("/restaurant/onboarding/documents") && !isBusinessInfoComplete) {
    return <Navigate to="/restaurant/onboarding/business-information" replace />;
  }

  if (pathname.includes("/restaurant/onboarding/location") && !isDocumentsComplete) {
    if (!isBusinessInfoComplete) {
      return <Navigate to="/restaurant/onboarding/business-information" replace />;
    }
    return <Navigate to="/restaurant/onboarding/documents" replace />;
  }

  if (pathname.includes("/restaurant/onboarding/review") && !isLocationComplete) {
    if (!isBusinessInfoComplete) {
      return <Navigate to="/restaurant/onboarding/business-information" replace />;
    }
    if (!isDocumentsComplete) {
      return <Navigate to="/restaurant/onboarding/documents" replace />;
    }
    return <Navigate to="/restaurant/onboarding/location" replace />;
  }

  return (
    <div className="min-h-screen bg-neutral-100">
      {/* Top navbar — branding only */}
      <header className="border-b border-neutral-200 bg-white">
        <div className="flex h-16 items-center px-6 sm:px-10">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500">
              <span className="text-sm font-bold text-white">S</span>
            </div>
            <span className="text-lg">
              <span className="font-bold text-neutral-900">SpotQ</span>{" "}
              <span className="text-neutral-500">for restaurants</span>
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-10 sm:px-10 lg:flex-row">
        <OnboardSidebar />

        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
