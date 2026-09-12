import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/auth.store";
import DocumentUploadCard from "../components/DocumentUploadCard";
import ImageUploadSection from "../components/ImageUploadSection";
import { ONBOARD_MESSAGES } from "../constants/onboard.constants";
import { useOnboardStore } from "../store/onboard.store";
import type { DocumentsState } from "../types/onboard.types";

interface DocumentFieldConfig {
  key: keyof DocumentsState;
  id: string;
  label: string;
  required: boolean;
}

const DOCUMENT_FIELDS: DocumentFieldConfig[] = [
  { key: "fssai", id: "fssai-doc", label: "FSSAI Certificate", required: true },
  {
    key: "businessRegistration",
    id: "business-registration-doc",
    label: "Business Registration Certificate",
    required: true,
  },
  { key: "ownerIdentity", id: "owner-identity-doc", label: "Owner Identity Proof", required: true },
  { key: "gst", id: "gst-doc", label: "GST Certificate", required: false },
  { key: "businessPan", id: "business-pan-doc", label: "Business PAN Card", required: false },
];

export default function DocumentsPage() {
  const navigate = useNavigate();
  const restaurantId = useAuthStore((state) => state.user?.restaurantId) || "";

  const documents = useOnboardStore((state) => state.documents);
  const restaurantImages = useOnboardStore((state) => state.restaurantImages);
  const setDocument = useOnboardStore((state) => state.setDocument);
  const addRestaurantImage = useOnboardStore((state) => state.addRestaurantImage);
  const removeRestaurantImage = useOnboardStore((state) => state.removeRestaurantImage);

  const [validationError, setValidationError] = useState<string | null>(null);
  const [activeUploadsCount, setActiveUploadsCount] = useState<number>(0);

  const handleUploadingChange = (uploading: boolean) => {
    setActiveUploadsCount((prev) => (uploading ? prev + 1 : Math.max(0, prev - 1)));
  };

  const handleContinue = () => {
    setValidationError(null);

    const isFssaiUploaded = !!documents.fssai;
    const isRegUploaded = !!documents.businessRegistration;
    const isIdentityUploaded = !!documents.ownerIdentity;
    const isPhotosUploaded = restaurantImages.length > 0;

    // AC1: FSSAI, Business Registration, and Owner Identity are required. GST and Business PAN are optional.
    if (!isFssaiUploaded || !isRegUploaded || !isIdentityUploaded) {
      setValidationError(ONBOARD_MESSAGES.DOCUMENTS_REQUIRED);
      return;
    }

    if (!isPhotosUploaded) {
      setValidationError(ONBOARD_MESSAGES.PHOTOS_REQUIRED);
      return;
    }

    navigate("/restaurant/onboarding/review");
  };

  const handleBack = () => {
    navigate("/restaurant/onboarding/business-information");
  };

  const isUploadingActive = activeUploadsCount > 0;

  // Calculate required completed count for helpful header badge
  const requiredUploadedCount =
    (documents.fssai ? 1 : 0) +
    (documents.businessRegistration ? 1 : 0) +
    (documents.ownerIdentity ? 1 : 0);

  return (
    <div className="w-full max-w-xl">
      <div className="rounded-3xl border border-neutral-200/90 bg-white p-6 shadow-xs sm:p-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-neutral-100 pb-5">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl">
              Documents &amp; Photos
            </h2>
            <p className="mt-1 text-sm text-neutral-600">
              Upload required registration certificates and restaurant images to complete
              onboarding.
            </p>
          </div>
          <div className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-700 border border-orange-200/80 self-start sm:self-center">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
            <span>{requiredUploadedCount}/3 Required Docs</span>
          </div>
        </div>

        {validationError && (
          <div
            role="alert"
            className="mt-6 flex items-start gap-2.5 rounded-2xl bg-red-50 p-4 text-xs font-semibold text-red-800 border border-red-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="h-4 w-4 shrink-0 text-red-600 mt-0.5"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
              />
            </svg>
            <span>{validationError}</span>
          </div>
        )}

        <div className="mt-6 space-y-4">
          {DOCUMENT_FIELDS.map((field) => (
            <DocumentUploadCard
              key={field.key}
              id={field.id}
              label={field.label}
              required={field.required}
              value={documents[field.key]}
              onChange={(doc) => setDocument(field.key, doc)}
              restaurantId={restaurantId}
              onUploadingChange={handleUploadingChange}
            />
          ))}

          <ImageUploadSection
            images={restaurantImages}
            onAddImage={addRestaurantImage}
            onRemoveImage={removeRestaurantImage}
            restaurantId={restaurantId}
            onUploadingChange={handleUploadingChange}
          />
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-3 pt-2">
          <button
            type="button"
            onClick={handleBack}
            className="flex-1 rounded-2xl border border-neutral-300 bg-white py-3.5 text-base font-semibold text-neutral-700 shadow-xs transition-colors hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-400 cursor-pointer"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleContinue}
            disabled={isUploadingActive}
            className="flex-1 rounded-2xl bg-orange-500 py-3.5 text-base font-semibold text-white shadow-xs transition-all hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isUploadingActive ? "Uploading..." : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}
