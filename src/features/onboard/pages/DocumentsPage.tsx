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

const REQUIRED_FIELDS: DocumentFieldConfig[] = [
  { key: "fssai", id: "fssai-doc", label: "FSSAI Certificate", required: true },
  {
    key: "businessRegistration",
    id: "business-registration-doc",
    label: "Business Registration Certificate",
    required: true,
  },
  { key: "ownerIdentity", id: "owner-identity-doc", label: "Owner Identity Proof", required: true },
];

const OPTIONAL_FIELDS: DocumentFieldConfig[] = [
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

  // Calculate required completed count for header badge
  const requiredUploadedCount =
    (documents.fssai ? 1 : 0) +
    (documents.businessRegistration ? 1 : 0) +
    (documents.ownerIdentity ? 1 : 0);

  const optionalUploadedCount = (documents.gst ? 1 : 0) + (documents.businessPan ? 1 : 0);

  return (
    <div className="w-full max-w-4xl lg:max-w-5xl">
      <div className="rounded-3xl border border-neutral-200/90 bg-white p-6 shadow-xs sm:p-8">
        {/* Header section */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-neutral-100 pb-6">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl">
                Documents &amp; Photos
              </h2>
            </div>
            <p className="mt-1 text-sm text-neutral-600">
              Upload required business verification certificates and restaurant photos to proceed.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-700 border border-orange-200/80">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
              <span>{requiredUploadedCount}/3 Required Docs</span>
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-600 border border-neutral-200">
              <span>{optionalUploadedCount}/2 Optional</span>
            </div>
          </div>
        </div>

        {/* Validation error alert */}
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

        <div className="mt-6 space-y-7">
          {/* Required Verification Documents Section */}
          <div>
            <div className="mb-3.5 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Required Verification Documents
              </h3>
              <span className="text-xs text-neutral-400 font-medium">All 3 mandatory</span>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {REQUIRED_FIELDS.map((field) => (
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
            </div>
          </div>

          {/* Optional Tax & ID Documents Section */}
          <div>
            <div className="mb-3.5 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Optional Tax &amp; Registration Documents
              </h3>
              <span className="text-xs text-neutral-400 font-medium">Optional</span>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {OPTIONAL_FIELDS.map((field) => (
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
            </div>
          </div>

          {/* Restaurant Gallery Section */}
          <div>
            <div className="mb-3.5 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Restaurant Showcase Photos
              </h3>
              <span className="text-xs text-neutral-400 font-medium">At least 1 photo</span>
            </div>
            <ImageUploadSection
              images={restaurantImages}
              onAddImage={addRestaurantImage}
              onRemoveImage={removeRestaurantImage}
              restaurantId={restaurantId}
              onUploadingChange={handleUploadingChange}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex items-center justify-between gap-4 border-t border-neutral-100 pt-6">
          <button
            type="button"
            onClick={handleBack}
            className="rounded-2xl border border-neutral-300 bg-white px-7 py-3 text-sm font-semibold text-neutral-700 shadow-2xs transition-colors hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-400 cursor-pointer"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleContinue}
            disabled={isUploadingActive}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-8 py-3 text-sm font-semibold text-white shadow-xs transition-all hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <span>{isUploadingActive ? "Uploading..." : "Continue"}</span>
            {!isUploadingActive && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
