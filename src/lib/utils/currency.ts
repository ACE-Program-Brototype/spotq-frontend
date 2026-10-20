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
