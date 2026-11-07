import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { RESTAURANT_ROUTES } from "@/app/router/routes.constants";
import { AUTH_MESSAGES } from "@/features/auth/constants/auth.constants";
import {
  type CompleteRestaurantOnboardingPayload,
  completeRestaurantOnboarding,
} from "@/features/auth/services/auth.service";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { ReviewBusinessInfoSection } from "../components/ReviewBusinessInfoSection";
import { ReviewDocumentsSection } from "../components/ReviewDocumentsSection";
import { ReviewLocationSection } from "../components/ReviewLocationSection";
import { useOnboardStore } from "../store/onboard.store";

export default function ReviewPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const businessInformation = useOnboardStore((state) => state.businessInformation);
  const documents = useOnboardStore((state) => state.documents);
  const restaurantImages = useOnboardStore((state) => state.restaurantImages);
  const location = useOnboardStore((state) => state.location);

  const isBusinessInfoComplete = !!businessInformation;
  const isDocumentsComplete =
    !!documents.fssai &&
    !!documents.businessRegistration &&
    !!documents.ownerIdentity &&
    !!documents.gst &&
    !!documents.businessPan &&
    restaurantImages.length > 0;
  const isLocationComplete = !!location;

  const isAllComplete = isBusinessInfoComplete && isDocumentsComplete && isLocationComplete;

  const handleBack = () => {
    navigate(RESTAURANT_ROUTES.ONBOARDING.LOCATION);
  };

  const handleSubmit = async () => {
    if (!isAllComplete || !businessInformation || !location) {
      toast.error("Please complete all required onboarding steps before submitting.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const payload: CompleteRestaurantOnboardingPayload = {
        restaurantName: businessInformation.restaurant_name,
        phone: businessInformation.phone,
        ownerName: businessInformation.owner_name,
        seatingCapacity: businessInformation.seating_capacity
          ? Number(businessInformation.seating_capacity)
          : undefined,
        documents: {
          fssai: {
            documentName: documents.fssai?.documentName ?? "",
            documentKey: documents.fssai?.documentKey ?? "",
          },
          businessRegistration: {
            documentName: documents.businessRegistration?.documentName ?? "",
            documentKey: documents.businessRegistration?.documentKey ?? "",
          },
          ownerIdentity: {
            documentName: documents.ownerIdentity?.documentName ?? "",
            documentKey: documents.ownerIdentity?.documentKey ?? "",
          },
          gst: {
            documentName: documents.gst?.documentName ?? "",
            documentKey: documents.gst?.documentKey ?? "",
          },
          businessPan: {
            documentName: documents.businessPan?.documentName ?? "",
            documentKey: documents.businessPan?.documentKey ?? "",
          },
        },
        restaurantImages: restaurantImages.map((img, idx) => ({
          objectKey: img.objectKey,
          fileName: img.fileName,
          displayOrder: img.displayOrder ?? idx + 1,
        })),
        location: {
          addressLine1: location.address_line1,
          addressLine2: location.address_line2 || null,
          city: location.city,
          state: location.state,
          country: location.country,
          pincode: location.pincode,
          latitude: Number(location.latitude),
          longitude: Number(location.longitude),
        },
      };

      await completeRestaurantOnboarding(payload);

      useOnboardStore.getState().resetOnboardStore();

      const currentUser = useAuthStore.getState().user;
      if (currentUser) {
        useAuthStore.getState().setUser({
          ...currentUser,
          onboardingStatus: "COMPLETED",
        });
      }

      toast.success(AUTH_MESSAGES.RESTAURANT_ONBOARD_SUCCESS);

      navigate(RESTAURANT_ROUTES.ONBOARDING.STATUS, { replace: true });
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to submit onboarding application.";
      setSubmitError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl space-y-6">
      {/* Header Card */}
      <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-xs sm:p-8">
        <h2 className="text-xl font-bold text-neutral-900 sm:text-2xl">Review &amp; Submit</h2>
        <p className="mt-1.5 text-sm text-neutral-600">
          Review your restaurant information before submitting for onboarding approval.
        </p>

        {!isAllComplete && (
          <div
            role="alert"
            className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800"
          >
            <svg
              className="mt-0.5 h-5 w-5 shrink-0 text-amber-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div>
              <p className="font-semibold text-amber-900">Some onboarding steps are incomplete</p>
              <p className="mt-1 text-xs text-amber-700">
                Please go back and complete all required details before submitting your application.
              </p>
            </div>
          </div>
        )}

        <div className="mt-6 space-y-6">
          <ReviewBusinessInfoSection
            businessInformation={businessInformation}
            onEdit={() => navigate(RESTAURANT_ROUTES.ONBOARDING.BUSINESS_INFORMATION)}
          />

          <ReviewDocumentsSection
            documents={documents}
            restaurantImages={restaurantImages}
            onEdit={() => navigate(RESTAURANT_ROUTES.ONBOARDING.DOCUMENTS)}
          />

          <ReviewLocationSection
            location={location}
            onEdit={() => navigate(RESTAURANT_ROUTES.ONBOARDING.LOCATION)}
          />
        </div>

        {submitError && (
          <div
            role="alert"
            className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700"
          >
            {submitError}
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex gap-3 pt-2">
          <button
            type="button"
            onClick={handleBack}
            disabled={isSubmitting}
            className="flex-1 rounded-2xl border border-neutral-300 bg-white py-3.5 text-base font-semibold text-neutral-700 shadow-xs transition-colors hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-400 disabled:opacity-50"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isAllComplete || isSubmitting}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 py-3.5 text-base font-semibold text-white shadow-xs transition-colors hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-neutral-300"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="h-5 w-5 animate-spin text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                Submitting Application...
              </>
            ) : (
              "Submit Application"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
