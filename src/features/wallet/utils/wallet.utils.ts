export function maskAccountNumber(accountNumber: string | null): string {
  if (!accountNumber) return "Unavailable";
  return `•••• •••• ${accountNumber.slice(-4)}`;
}

export const formatLabel = (value: string) =>
  value
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
