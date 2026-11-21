export function formatCurrency(amount: number | string | null | undefined): string {
  const numericAmount =
    typeof amount === "string" ? Number.parseFloat(amount) : Number(amount ?? 0);
  const validAmount = Number.isFinite(numericAmount) ? numericAmount : 0;

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(validAmount);
}

/**
 * Formats large numbers compactly into K (thousands), M (millions), B (billions)
 * with customizable decimal precision.
 * Examples: 950 -> "950", 1250 -> "1.3K", 125400.5 -> "125.4K", 1500000 -> "1.5M", 2400000000 -> "2.4B"
 */
export function formatCompactNumber(
  val: number | string | null | undefined,
  decimals = 1,
): string {
  if (val == null) return "0";
  const num = typeof val === "string" ? Number.parseFloat(val) : Number(val);
  if (!Number.isFinite(num)) return "0";

  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: decimals,
  }).format(num);
}

/**
 * Formats large monetary values into compact INR currency with K/M/B notation.
 * Examples: 500 -> "₹500", 125400.5 -> "₹125.4K", 1500000 -> "₹1.5M", 2350000000 -> "₹2.4B"
 */
export function formatCompactCurrency(
  amount: number | string | null | undefined,
  decimals = 1,
): string {
  if (amount == null) return "₹0";
  const num = typeof amount === "string" ? Number.parseFloat(amount) : Number(amount);
  if (!Number.isFinite(num)) return "₹0";

  const isNegative = num < 0;
  const absFormatted = formatCompactNumber(Math.abs(num), decimals);
  return isNegative ? `-₹${absFormatted}` : `₹${absFormatted}`;
}

