export const statusStyles: Record<TableStatus, string> = {
  AVAILABLE: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  OCCUPIED: "bg-sky-50 text-sky-700 ring-sky-200",
  PARTIAL_OCCUPIED: "bg-amber-50 text-amber-700 ring-amber-200",
  MAINTENANCE: "bg-slate-100 text-slate-600 ring-slate-200",
};

export const statusLabels: Record<TableStatus, string> = {
  AVAILABLE: "Available",
  OCCUPIED: "Occupied",
  PARTIAL_OCCUPIED: "Partially occupied",
  MAINTENANCE: "Maintenance",
};

import type {
  StaffUpdatableStatus,
  TableStatus,
  TableStatusTransitionRule,
} from "../types/table.types";

export const TABLE_STATUS = {
  ALL: "ALL",
  AVAILABLE: "AVAILABLE",
  OCCUPIED: "OCCUPIED",
  PARTIAL_OCCUPIED: "PARTIAL_OCCUPIED",
  MAINTENANCE: "MAINTENANCE",
} as const;

export const TABLE_SHAPE = {
  CIRCLE: "CIRCLE",
  SQUARE: "SQUARE",
} as const;

export const TABLE_QUERY_KEYS = {
  ALL: ["tables"] as const,
  LIST: (restaurantId: string) => ["tables", restaurantId] as const,
  SECTIONS: (restaurantId: string) => ["tables", restaurantId, "sections"] as const,
  SECTIONS_PAGINATED: (restaurantId: string, page: number, limit: number) =>
    ["tables", restaurantId, "sections", "paginated", { page, limit }] as const,
  DETAILS: (restaurantId: string, tableId: string) => ["tables", restaurantId, tableId] as const,
} as const;

export const TABLE_SERVICE_ERRORS = {
  CREATE_RESTAURANT_ID_REQUIRED: "Restaurant ID is required to create a table",
  CREATE_FAILED: "Unable to create table",
  DETAILS_IDS_REQUIRED: "Restaurant ID and table ID are required to fetch table details",
  LIST_RESTAURANT_ID_REQUIRED: "Restaurant ID is required to fetch tables",
  SECTIONS_RESTAURANT_ID_REQUIRED: "Restaurant ID is required to fetch table sections",
  DELETE_SECTION_IDS_REQUIRED: "Restaurant ID and Section ID are required to delete a section",
  UNLIST_SECTION_IDS_REQUIRED: "Restaurant ID and Section ID are required to delete a section",
  UPDATE_IDS_REQUIRED: "Restaurant ID and Table ID are required to update status",
  RELEASE_IDS_REQUIRED: "Restaurant ID and at least one table entry are required to release tables",
  RELEASE_FAILED: "Failed to release table occupancy. Please try again.",
} as const;

export const CREATE_TABLE_VALIDATION_MESSAGES = {
  TABLE_CODE_REQUIRED: "Table name or code is required",
  SECTION_REQUIRED: "Select a dining section",
  CAPACITY_NUMBER: "Seating capacity must be a number",
  CAPACITY_INTEGER: "Seating capacity must be a whole number",
  CAPACITY_MIN: "Seating capacity must be at least 1",
  CAPACITY_MAX: "Seating capacity cannot exceed 100",
} as const;

export const TABLE_ENDPOINTS = {
  LIST: (restaurantId: string) => `restaurants/${restaurantId}/table`,
  CREATE: (restaurantId: string) => `restaurants/${restaurantId}/table`,
  DETAILS: (restaurantId: string, tableId: string) =>
    `restaurants/${restaurantId}/table/${tableId}`,
  UPDATE_STATUS: (restaurantId: string, tableId: string) =>
    `restaurants/${restaurantId}/table/${tableId}/status`,
  RELEASE: (restaurantId: string) => `restaurants/${restaurantId}/tables/release`,
  TABLE_SECTION: (restaurantId: string) => `restaurants/${restaurantId}/table-sections`,
  TABLE_SECTION_DELETE: (restaurantId: string, sectionId: string) =>
    `restaurants/${restaurantId}/table-sections/${sectionId}`,
} as const;

export const TABLE_SECTION_MESSAGES = {
  CREATE_SUCCESS: "Table section created successfully",
  CREATE_FAILED: "Unable to create table section",
  DELETE_SUCCESS: "Table section unlisted successfully",
  DELETE_FAILED: "Unable to unlist table section",
  FETCH_FAILED: "Unable to load table sections. Please try again.",
} as const;

export const CREATE_SECTION_MODAL_STRINGS = {
  TITLE: "Create Table Section",
  DESCRIPTION: "Define a new dining zone on your restaurant floor.",
  FIELD_LABEL: "Section Name",
  PLACEHOLDER: "e.g. Patio, Rooftop, Main Dining",
  CLOSE_LABEL: "Close modal",
  CANCEL_BUTTON: "Cancel",
  SUBMIT_BUTTON: "Create Section",
  SUBMITTING_BUTTON: "Creating...",
  VALIDATION_MIN: "Section name must be at least 2 characters",
  VALIDATION_MAX: "Section name cannot exceed 100 characters",
} as const;

export interface StatusVisualConfig {
  label: string;
  shortLabel?: string;
  badgeClass: string;
  dotClass: string;
  topBorderClass: string;
  cardBorderClass: string;
  cardBgClass: string;
}

export const TABLE_STATUS_CONFIG: Record<TableStatus, StatusVisualConfig> = {
  AVAILABLE: {
    label: "Available",
    shortLabel: "Available",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dotClass: "bg-emerald-500",
    topBorderClass: "border-t-4 border-emerald-600",
    cardBorderClass: "border-neutral-200/90 hover:border-emerald-500/60",
    cardBgClass: "bg-white",
  },
  OCCUPIED: {
    label: "Occupied",
    shortLabel: "Occupied",
    badgeClass: "bg-[#ffedd5] text-[#9a3412] border-[#fed7aa]",
    dotClass: "bg-[#ea580c]",
    topBorderClass: "border-t-4 border-[#9a3412]",
    cardBorderClass: "border-2 border-[#9a3412] shadow-xs",
    cardBgClass: "bg-[#fffcf9]",
  },
  MAINTENANCE: {
    label: "Maintenance",
    shortLabel: "Maintenance",
    badgeClass: "bg-neutral-100 text-neutral-600 border-neutral-300",
    dotClass: "bg-neutral-400",
    topBorderClass: "border-t-4 border-neutral-400",
    cardBorderClass: "border-neutral-200 hover:border-neutral-400/70",
    cardBgClass: "bg-[#faf9f8]",
  },
  PARTIAL_OCCUPIED: {
    label: "Partially Occupied",
    shortLabel: "Partial",
    badgeClass: "bg-amber-50 text-amber-800 border-amber-200",
    dotClass: "bg-amber-500",
    topBorderClass: "border-t-4 border-amber-500",
    cardBorderClass: "border-amber-200/90 hover:border-amber-400",
    cardBgClass: "bg-white",
  },
};

/**
 * Business Rule for Staff Table Status Updates:
 * - Staff can change status to AVAILABLE only if current status is MAINTENANCE.
 * - Staff can change status to MAINTENANCE only if current status is AVAILABLE.
 * - OCCUPIED and PARTIAL_OCCUPIED are managed through orders / guest checkouts.
 */
export function getStaffStatusTransition(currentStatus: TableStatus): TableStatusTransitionRule {
  switch (currentStatus) {
    case "MAINTENANCE":
      return {
        allowed: true,
        targetStatus: "AVAILABLE",
        reason: "Restore table back into live dining rotation.",
      };
    case "AVAILABLE":
      return {
        allowed: true,
        targetStatus: "MAINTENANCE",
        reason: "Mark table for cleaning, repairs, or temporary hold.",
      };
    case "OCCUPIED":
      return {
        allowed: false,
        targetStatus: null,
        reason:
          "Table is currently occupied by active diners. Please clear via Order Management or Queue checkout.",
      };
    case "PARTIAL_OCCUPIED":
      return {
        allowed: false,
        targetStatus: null,
        reason:
          "Table has active diners seated. Status cannot be modified to Maintenance or Available while occupied.",
      };
    default:
      return {
        allowed: false,
        targetStatus: null,
        reason: "Status cannot be updated by staff.",
      };
  }
}

export const TABLE_MESSAGES = {
  CREATE_SUCCESS: "Table created successfully.",
  CREATE_FAILED: "Unable to create table.",
  TITLE: "Table Management",
  SUBTITLE: "Manage layout, status, and active orders.",
  STATUS_UPDATE_SUCCESS: (code: string, newStatus: StaffUpdatableStatus) =>
    `Table ${code} status changed to ${TABLE_STATUS_CONFIG[newStatus].label}.`,
  STATUS_UPDATE_FAILED: "Failed to update table status. Please try again.",
  RELEASE_SUCCESS: (code: string, releasedSeats: number) =>
    `Released ${releasedSeats} ${releasedSeats === 1 ? "seat" : "seats"} from Table ${code}.`,
  RELEASE_FAILED: "Failed to release table occupancy. Please try again.",
  FETCH_FAILED: "Unable to load restaurant tables. Please check your connection and retry.",
  NO_RESTAURANT: "No restaurant assigned",
  NO_RESTAURANT_DESC: "Your account is not associated with any restaurant.",
  NO_SECTIONS: "No dining sections available",
  NO_SECTIONS_DESC: "Dining sections have not been configured for this restaurant.",
  NO_TABLES_IN_SECTION: "No tables found in this section",
  NO_TABLES_IN_SECTION_DESC:
    "There are currently no active dining tables assigned to this section.",
} as const;

export const ADMIN_TABLE_LIMIT = 9;

export const KEYBOARD_KEYS = {
  ESCAPE: "Escape",
  TAB: "Tab",
} as const;

export const DOM_EVENTS = {
  KEY_DOWN: "keydown",
  MOUSE_DOWN: "mousedown",
} as const;
