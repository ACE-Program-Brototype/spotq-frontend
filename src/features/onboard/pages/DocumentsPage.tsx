import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/auth.store";
import DocumentUploadCard from "../components/DocumentUploadCard";
import ImageUploadSection from "../components/ImageUploadSection";
import { useOnboardStore } from "../store/onboard.store";
import type { DocumentsState } from "../types/onboard.types";

interface DocumentFieldConfig {
  key: keyof DocumentsState;
  id: string;
  label: string;
}

const DOCUMENT_FIELDS: DocumentFieldConfig[] = [
  { key: "fssai", id: "fssai-doc", label: "FSSAI Certificate" },
  {
    key: "businessRegistration",
    id: "business-registration-doc",
    label: "Business Registration Certificate",
  },
  { key: "ownerIdentity", id: "owner-identity-doc", label: "Owner Identity Proof" },
  { key: "gst", id: "gst-doc", label: "GST Certificate" },
  { key: "businessPan", id: "business-pan-doc", label: "Business PAN Card" },
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

  const handleContinue = () => {
    setValidationError(null);

    const isFssaiUploaded = !!documents.fssai;
    const isRegUploaded = !!documents.businessRegistration;
    const isIdentityUploaded = !!documents.ownerIdentity;
    const isGstUploaded = !!documents.gst;
    const isPanUploaded = !!documents.businessPan;
    const isPhotosUploaded = restaurantImages.length > 0;

    if (
      !isFssaiUploaded ||
      !isRegUploaded ||
      !isIdentityUploaded ||
      !isGstUploaded ||
      !isPanUploaded
    ) {
      setValidationError("Please upload all required business documents before proceeding.");
      return;
    }

    if (!isPhotosUploaded) {
      setValidationError("Please upload at least one restaurant photo before proceeding.");
      return;
    }

    navigate("/restaurant/onboarding/review");
  };

  const handleBack = () => {
    navigate("/restaurant/onboarding/business-information");
  };

  return (
    <div className="w-full max-w-xl">
      <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-xs sm:p-8">
        <h2 className="text-xl font-bold text-neutral-900 sm:text-2xl">Documents &amp; Photos</h2>
        <p className="mt-1.5 text-sm text-neutral-600">
          Upload required registration certificates and restaurant images to complete onboarding.
        </p>

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
              value={documents[field.key]}
              onChange={(doc) => setDocument(field.key, doc)}
              restaurantId={restaurantId}
            />
          ))}

          <ImageUploadSection
            images={restaurantImages}
            onAddImage={addRestaurantImage}
            onRemoveImage={removeRestaurantImage}
            restaurantId={restaurantId}
          />
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-3 pt-2">
          <button
            type="button"
            onClick={handleBack}
            className="flex-1 rounded-2xl border border-neutral-300 bg-white py-3.5 text-base font-semibold text-neutral-700 shadow-xs transition-colors hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-400"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleContinue}
            className="flex-1 rounded-2xl bg-orange-500 py-3.5 text-base font-semibold text-white shadow-xs transition-colors hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
