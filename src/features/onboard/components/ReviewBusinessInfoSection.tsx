import type { BusinessInformation } from "../types/onboard.types";

interface ReviewBusinessInfoSectionProps {
  businessInformation: BusinessInformation | null;
  onEdit: () => void;
}

export function ReviewBusinessInfoSection({
  businessInformation,
  onEdit,
}: ReviewBusinessInfoSectionProps) {
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
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          <h3 className="font-semibold text-neutral-900">Business Information</h3>
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
            <p className="text-sm font-semibold text-neutral-900">{businessInformation.phone}</p>
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
  );
}
