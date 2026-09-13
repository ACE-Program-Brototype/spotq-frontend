import env from "@/config/env";
import type { RestaurantAddress } from "@/features/onboard/types/onboard.types";

export interface LocationIqRawAddress {
  name?: string;
  house_number?: string;
  road?: string;
  suburb?: string;
  neighbourhood?: string;
  city?: string;
  town?: string;
  village?: string;
  county?: string;
  state?: string;
  postcode?: string;
  country?: string;
  country_code?: string;
}

export interface LocationIqRawItem {
  place_id: string;
  lat: string;
  lon: string;
  display_name: string;
  address?: LocationIqRawAddress;
}

export function mapLocationIqToAddress(item: LocationIqRawItem): RestaurantAddress {
  const addr = item.address || {};
  const lat = Number.parseFloat(item.lat);
  const lon = Number.parseFloat(item.lon);

  const addressLine1 = addr.house_number
    ? `${addr.house_number} ${addr.road || ""}`.trim()
    : addr.road || item.display_name.split(",")[0]?.trim() || "";

  const addressLine2 = addr.suburb || addr.neighbourhood || addr.county || "";
  const city = addr.city || addr.town || addr.village || addr.county || "";
  const state = addr.state || "";
  const country = addr.country || "India";
  const pincode = addr.postcode || "";

  return {
    address_line1: addressLine1,
    address_line2: addressLine2,
    city,
    state,
    country,
    pincode,
    latitude: Number.isNaN(lat) ? 0 : Math.max(-90, Math.min(90, lat)),
    longitude: Number.isNaN(lon) ? 0 : Math.max(-180, Math.min(180, lon)),
  };
}

export async function searchLocationIQ(
  query: string,
  signal?: AbortSignal,
): Promise<LocationIqRawItem[]> {
  const trimmed = query.trim();
  if (trimmed.length < 3) return [];

  const token = env.locationIqToken;
  if (!token) {
    throw new Error("LocationIQ access token is not configured.");
  }

  const url = new URL("https://api.locationiq.com/v1/autocomplete");
  url.searchParams.set("key", token);
  url.searchParams.set("q", trimmed);
  url.searchParams.set("limit", "5");
  url.searchParams.set("countrycodes", "in");
  url.searchParams.set("format", "json");
  url.searchParams.set("addressdetails", "1");

  const response = await fetch(url.toString(), { signal });

  if (!response.ok) {
    if (response.status === 404) return [];
    if (response.status === 429) {
      throw new Error("Search rate limit reached. Please wait a moment and try again.");
    }
    throw new Error(`Location search failed with status ${response.status}`);
  }

  const data = await response.json();
  if (!Array.isArray(data)) return [];

  return data;
}
