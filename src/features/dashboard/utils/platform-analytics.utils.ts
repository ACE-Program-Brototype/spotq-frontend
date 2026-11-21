export function formatRupees(amount?: number | null, compact = false): string {
  if (amount == null || Number.isNaN(amount)) {
    return "—";
  }

  if (compact) {
    if (Math.abs(amount) >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)}Cr`;
    }
    if (Math.abs(amount) >= 100000) {
      return `₹${(amount / 100000).toFixed(2)}L`;
    }
    if (Math.abs(amount) >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}k`;
    }
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(val?: number | null): string {
  if (val == null || Number.isNaN(val)) {
    return "—";
  }
  return new Intl.NumberFormat("en-IN").format(val);
}

export function formatPercentage(val?: number | null): string {
  if (val == null || Number.isNaN(val)) {
    return "—";
  }
  return `${val > 0 ? "+" : ""}${val.toFixed(1)}%`;
}

export function formatSyncTimestamp(isoString?: string): string {
  if (!isoString) return "Just now";
  try {
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) return "Just now";
    return new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Kolkata",
    }).format(date);
  } catch {
    return "Just now";
  }
}

export function sanitizeTierLabel(tierKey: string): string {
  return tierKey
    .replace(/[_-]+/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
