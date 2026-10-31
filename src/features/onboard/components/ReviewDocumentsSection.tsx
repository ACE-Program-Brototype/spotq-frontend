import type { DocumentsState, RestaurantImageItem } from "../types/onboard.types";

const DOCUMENT_LABELS: Record<string, string> = {
  fssai: "FSSAI License Certificate",
  businessRegistration: "Business Registration Document",
  ownerIdentity: "Owner Identity Proof",
  gst: "GST Registration Certificate",
  businessPan: "Business PAN Card",
};

interface ReviewDocumentsSectionProps {
  documents: DocumentsState;
  restaurantImages: RestaurantImageItem[];
  onEdit: () => void;
}

export function ReviewDocumentsSection({
  documents,
  restaurantImages,
  onEdit,
}: ReviewDocumentsSectionProps) {
  return (
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
          onClick={onEdit}
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
          const doc = documents[key as keyof DocumentsState];
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
  );
}
