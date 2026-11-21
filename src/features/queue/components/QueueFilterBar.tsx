import { Globe, Search, UserPlus, Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  PARTY_SIZE_BUCKET,
  PARTY_SIZE_BUCKET_LABELS,
  REGISTRATION_TYPE_FILTER,
} from "@/features/queue/constants/queue.constants";
import type { PartySizeBucket, RegistrationTypeFilter } from "@/features/queue/types/queue.types";

interface QueueFilterBarProps {
  registrationTypeFilter: RegistrationTypeFilter;
  onRegistrationTypeChange: (filter: RegistrationTypeFilter) => void;
  partySizeFilter: PartySizeBucket;
  onPartySizeChange: (filter: PartySizeBucket) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddWalkInClick: () => void;
  isConnected: boolean;
}

export function QueueFilterBar({
  registrationTypeFilter,
  onRegistrationTypeChange,
  partySizeFilter,
  onPartySizeChange,
  searchQuery,
  onSearchChange,
  onAddWalkInClick,
  isConnected,
}: QueueFilterBarProps) {
  return (
    <div
      data-testid="queue-filter-bar"
      className="flex flex-col gap-4 rounded-2xl border border-[#eadfd8] bg-white p-4 sm:p-5 shadow-xs"
    >
      {/* Top row: Search input + Live Status Badge + Add to Queue CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#756c66]" />
          <Input
            type="text"
            placeholder="Search by guest name, phone, ticket #..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-10 pl-10 pr-9 rounded-xl border-[#eadfd8] bg-[#faf7f5]/40 text-xs sm:text-sm focus-visible:ring-[#9a3412]"
            data-testid="queue-search-input"
          />
          {searchQuery && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          {/* Connection status indicator */}
          <span
            data-testid="queue-socket-status"
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold border transition-colors ${
              isConnected
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-amber-50 text-amber-700 border-amber-200"
            }`}
          >
            <span
              className={`size-1.5 rounded-full ${
                isConnected ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
              }`}
            />
            <span>{isConnected ? "Live Sync Active" : "Reconnecting..."}</span>
          </span>

          {/* Add to Queue Button */}
          <Button
            type="button"
            onClick={onAddWalkInClick}
            data-testid="add-walk-in-button"
            className="h-10 px-4 rounded-xl bg-[#9a3412] hover:bg-[#7c2d12] text-white font-bold text-xs sm:text-sm shadow-xs transition-all flex items-center gap-2"
          >
            <UserPlus className="size-4" />
            <span>Add Walk-In</span>
          </Button>
        </div>
      </div>

      {/* Bottom row: Filter Chips & Registration Types */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#f3e6de]">
        {/* Registration Type Segmented Control */}
        <div
          data-testid="registration-type-filters"
          className="inline-flex rounded-xl bg-[#faf7f5] p-1 border border-[#eadfd8]"
        >
          <button
            type="button"
            onClick={() => onRegistrationTypeChange(REGISTRATION_TYPE_FILTER.ALL)}
            data-testid="filter-registration-all"
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              registrationTypeFilter === REGISTRATION_TYPE_FILTER.ALL
                ? "bg-white text-[#9a3412] shadow-2xs font-extrabold"
                : "text-[#756c66] hover:text-neutral-900"
            }`}
          >
            All Guests
          </button>
          <button
            type="button"
            onClick={() => onRegistrationTypeChange(REGISTRATION_TYPE_FILTER.ONLINE)}
            data-testid="filter-registration-online"
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              registrationTypeFilter === REGISTRATION_TYPE_FILTER.ONLINE
                ? "bg-white text-[#9a3412] shadow-2xs font-extrabold"
                : "text-[#756c66] hover:text-neutral-900"
            }`}
          >
            <Globe className="size-3" />
            <span>Online</span>
          </button>
          <button
            type="button"
            onClick={() => onRegistrationTypeChange(REGISTRATION_TYPE_FILTER.WALK_IN)}
            data-testid="filter-registration-walk-in"
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              registrationTypeFilter === REGISTRATION_TYPE_FILTER.WALK_IN
                ? "bg-white text-[#9a3412] shadow-2xs font-extrabold"
                : "text-[#756c66] hover:text-neutral-900"
            }`}
          >
            <Users className="size-3" />
            <span>Walk-In</span>
          </button>
        </div>

        {/* Party Size Bucket Filter Chips */}
        <div data-testid="party-size-filters" className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-bold text-[#756c66] mr-1 hidden sm:inline">
            Party Size:
          </span>
          {Object.entries(PARTY_SIZE_BUCKET).map(([key, value]) => {
            const isSelected = partySizeFilter === value;
            return (
              <button
                key={key}
                type="button"
                onClick={() => onPartySizeChange(value)}
                data-testid={`filter-party-size-${value.toLowerCase()}`}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all border ${
                  isSelected
                    ? "bg-[#9a3412] text-white border-[#9a3412] shadow-2xs"
                    : "bg-[#faf7f5] text-[#756c66] border-[#eadfd8] hover:bg-[#f3e6de]/60 hover:text-neutral-900"
                }`}
              >
                {PARTY_SIZE_BUCKET_LABELS[value]}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
