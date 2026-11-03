import env from "@/config/env";
import { ACTIVE_QUEUE_STORAGE_KEY } from "../constants/websocket.constants";
import type { ActiveCustomerTicket } from "../types/ring-alert.types";

/**
 * Persists active customer queue ticket to local storage for session restoration.
 */
export function setActiveCustomerTicket(ticket: ActiveCustomerTicket): void {
  if (typeof window === "undefined" || !window.localStorage) return;
  try {
    localStorage.setItem(ACTIVE_QUEUE_STORAGE_KEY, JSON.stringify(ticket));
    // Dispatch in-tab storage event so current tab listeners immediately sync
    window.dispatchEvent(new Event("storage"));
  } catch (err) {
    if (env.isDev) {
      console.warn("Failed to persist active customer ticket:", err);
    }
  }
}

/**
 * Retrieves the currently active customer queue ticket from local storage.
 */
export function getActiveCustomerTicket(): ActiveCustomerTicket | null {
  if (typeof window === "undefined" || !window.localStorage) return null;
  try {
    const raw = localStorage.getItem(ACTIVE_QUEUE_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ActiveCustomerTicket;
  } catch {
    return null;
  }
}

/**
 * Removes active customer queue ticket from local storage (e.g. upon being seated or leaving).
 */
export function clearActiveCustomerTicket(): void {
  if (typeof window === "undefined" || !window.localStorage) return;
  try {
    localStorage.removeItem(ACTIVE_QUEUE_STORAGE_KEY);
    // Dispatch in-tab storage event so current tab listeners immediately sync
    window.dispatchEvent(new Event("storage"));
  } catch {}
}
