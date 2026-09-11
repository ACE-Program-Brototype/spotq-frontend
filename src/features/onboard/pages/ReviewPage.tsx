import { useNavigate } from "react-router-dom";
import { useOnboardStore } from "../store/onboard.store";

const DOCUMENT_LABELS: Record<string, string> = {
  fssai: "FSSAI License Certificate",
  businessRegistration: "Business Registration Document",
  ownerIdentity: "Owner Identity Proof",
  gst: "GST Registration Certificate",
  businessPan: "Business PAN Card",
};

export default function ReviewPage() {
  const navigate = useNavigate();

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
    navigate("/restaurant/onboarding/location");
  };

  const handleSubmit = () => {
    // Non-functional submit button as requested until backend endpoint is updated
    alert(
      "Onboarding endpoint connection will be completed once the backend restaurant service endpoint is updated.",
    );
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
          {/* Section 1: Business Information */}
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50/50 p-5">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <div className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-orange-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                <h3 className="font-semibold text-neutral-900">Business Information</h3>
              </div>
              <button
                type="button"
                onClick={() => navigate("/restaurant/onboarding/business-information")}
                className="flex items-center gap-1 text-xs font-semibold text-orange-600 hover:text-orange-700"
              >
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
                Edit
              </button>
            </div>

            {businessInformation ? (
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <span className="text-xs font-medium text-neutral-500">Restaurant Name</span>
                  <p className="text-sm font-semibold text-neutral-900">
                    {businessInformation.restaurant_name}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-medium text-neutral-500">Contact Phone</span>
                  <p className="text-sm font-semibold text-neutral-900">
                    {businessInformation.phone}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-medium text-neutral-500">Owner Name</span>
                  <p className="text-sm font-semibold text-neutral-900">
                    {businessInformation.owner_name}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-medium text-neutral-500">Seating Capacity</span>
                  <p className="text-sm font-semibold text-neutral-900">
                    {businessInformation.seating_capacity} seats
                  </p>
                </div>
              </div>
            ) : (
              <p className="mt-3 text-xs text-red-600">Business information not provided yet.</p>
            )}
          </div>

          {/* Section 2: Documents & Photos */}
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50/50 p-5">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <div className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-orange-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="font-semibold text-neutral-900">Documents &amp; Photos</h3>
              </div>
              <button
                type="button"
                onClick={() => navigate("/restaurant/onboarding/documents")}
                className="flex items-center gap-1 text-xs font-semibold text-orange-600 hover:text-orange-700"
              >
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
                Edit
              </button>
            </div>

            <div className="mt-4 space-y-2.5">
              {Object.entries(DOCUMENT_LABELS).map(([key, label]) => {
                const doc = documents[key as keyof typeof documents];
                return (
                  <div key={key} className="flex items-center justify-between text-xs">
                    <span className="font-medium text-neutral-700">{label}</span>
                    {doc ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 font-medium text-emerald-700">
                        <svg
                          className="h-3.5 w-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        {doc.documentName}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 font-medium text-red-600">
                        Missing
                      </span>
                    )}
                  </div>
                );
              })}

              <div className="flex items-center justify-between pt-1 text-xs border-t border-neutral-200">
                <span className="font-medium text-neutral-700">Restaurant Photos</span>
                {restaurantImages.length > 0 ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 font-medium text-emerald-700">
                    <svg
                      className="h-3.5 w-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {restaurantImages.length} photo{restaurantImages.length > 1 ? "s" : ""} uploaded
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 font-medium text-red-600">
                    No photos uploaded
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Location Details */}
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50/50 p-5">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <div className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-orange-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <h3 className="font-semibold text-neutral-900">Location Details</h3>
              </div>
              <button
                type="button"
                onClick={() => navigate("/restaurant/onboarding/location")}
                className="flex items-center gap-1 text-xs font-semibold text-orange-600 hover:text-orange-700"
              >
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
                Edit
              </button>
            </div>

            {location ? (
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
                <div className="sm:col-span-2">
                  <span className="font-medium text-neutral-500">Address</span>
                  <p className="text-sm font-semibold text-neutral-900">
                    {location.address_line1}
                    {location.address_line2 ? `, ${location.address_line2}` : ""}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-neutral-500">City / State</span>
                  <p className="text-sm font-semibold text-neutral-900">
                    {location.city}, {location.state}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-neutral-500">Country / Pincode</span>
                  <p className="text-sm font-semibold text-neutral-900">
                    {location.country} - {location.pincode}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-neutral-500">Latitude</span>
                  <p className="text-sm font-semibold text-neutral-900">{location.latitude}</p>
                </div>
                <div>
                  <span className="font-medium text-neutral-500">Longitude</span>
                  <p className="text-sm font-semibold text-neutral-900">{location.longitude}</p>
                </div>
              </div>
            ) : (
              <p className="mt-3 text-xs text-red-600">Location details not provided yet.</p>
            )}
          </div>
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
            onClick={handleSubmit}
            className="flex-1 rounded-2xl bg-orange-500 py-3.5 text-base font-semibold text-white shadow-xs transition-colors hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            Submit Application
          </button>
        </div>
      </div>
    </div>
  );
}
