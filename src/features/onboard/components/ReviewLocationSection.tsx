import type { RestaurantAddress } from "../types/onboard.types";

interface ReviewLocationSectionProps {
  location: RestaurantAddress | null;
  onEdit: () => void;
}

export function ReviewLocationSection({ location, onEdit }: ReviewLocationSectionProps) {
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
  );
}
