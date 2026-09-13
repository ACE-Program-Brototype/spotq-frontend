import { useEffect, useRef, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import {
  type LocationIqRawItem,
  mapLocationIqToAddress,
  searchLocationIQ,
} from "@/services/locationiq/locationiq.service";
import type { RestaurantAddress } from "../types/onboard.types";

interface LocationAutocompleteProps {
  onSelectLocation: (address: RestaurantAddress) => void;
  defaultValue?: string;
}

export default function LocationAutocomplete({
  onSelectLocation,
  defaultValue = "",
}: LocationAutocompleteProps) {
  const [query, setQuery] = useState(defaultValue);
  const debouncedQuery = useDebounce(query, 500);
  const [suggestions, setSuggestions] = useState<LocationIqRawItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const trimmed = debouncedQuery.trim();

    if (trimmed.length < 3) {
      setSuggestions([]);
      setIsLoading(false);
      setError(null);
      setIsOpen(false);
      return;
    }

    const controller = new AbortController();

    async function fetchLocations() {
      setIsLoading(true);
      setError(null);

      try {
        const results = await searchLocationIQ(trimmed, controller.signal);
        setSuggestions(results.slice(0, 5));
        setIsOpen(true);
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Failed to search location.");
        setSuggestions([]);
        setIsOpen(true);
      } finally {
        setIsLoading(false);
      }
    }

    fetchLocations();

    return () => {
      controller.abort();
    };
  }, [debouncedQuery]);

  // Handle outside click to close dropdown
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (item: LocationIqRawItem) => {
    setQuery(item.display_name);
    setIsOpen(false);
    const mapped = mapLocationIqToAddress(item);
    onSelectLocation(mapped);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <fieldset className="relative rounded-2xl border border-neutral-300 px-4 pb-2 pt-0.5 transition-colors focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-100">
        <legend className="ml-1 px-1.5 text-xs font-semibold text-neutral-600">
          <label htmlFor="location-search-input">Search Location*</label>
        </legend>
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="h-4 w-4 shrink-0 text-neutral-400"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
          <input
            id="location-search-input"
            type="text"
            placeholder="Type address or landmark (min 3 chars)..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (!isOpen && e.target.value.trim().length >= 3) setIsOpen(true);
            }}
            onFocus={() => {
              if (suggestions.length > 0 || error || query.trim().length >= 3) setIsOpen(true);
            }}
            className="w-full bg-transparent py-1 text-base text-neutral-900 outline-none placeholder:text-neutral-400"
          />
          {isLoading && (
            <svg
              className="h-4 w-4 animate-spin text-orange-500"
              viewBox="0 0 24 24"
              fill="none"
              role="img"
              aria-label="Loading suggestions"
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
          )}
        </div>
      </fieldset>

      {isOpen && (
        <div className="absolute left-0 right-0 z-20 mt-1 max-h-60 overflow-y-auto rounded-2xl border border-neutral-200 bg-white p-2 shadow-lg">
          {isLoading && (
            <div className="p-3 text-center text-xs text-neutral-500">Searching locations...</div>
          )}

          {error && <div className="p-3 text-center text-xs text-red-600 font-medium">{error}</div>}

          {!isLoading && !error && suggestions.length === 0 && query.trim().length >= 3 && (
            <div className="p-3 text-center text-xs text-neutral-500">
              No locations found. Try a different search query.
            </div>
          )}

          {!isLoading &&
            suggestions.map((item) => (
              <button
                key={item.place_id}
                type="button"
                onClick={() => handleSelect(item)}
                className="flex w-full flex-col items-start rounded-xl px-3 py-2 text-left text-xs transition-colors hover:bg-orange-50 hover:text-orange-900 focus:bg-orange-50 focus:outline-none"
              >
                <span className="font-semibold text-neutral-900 truncate w-full">
                  {item.display_name.split(",")[0]}
                </span>
                <span className="text-neutral-500 truncate w-full mt-0.5">{item.display_name}</span>
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
