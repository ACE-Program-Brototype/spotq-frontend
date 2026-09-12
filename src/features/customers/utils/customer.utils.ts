import { CUSTOMER_MESSAGES } from "../constants/customer.constants";

export function formatMemberSince(isoString?: string | null): string {
  if (!isoString) return "";
  try {
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) return "";
    const formatted = date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
    return `${CUSTOMER_MESSAGES.MEMBER_SINCE_PREFIX} ${formatted}`;
  } catch {
    return "";
  }
}

export function getCustomerInitials(fullName?: string | null): string {
  if (!fullName) return "CU";
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
