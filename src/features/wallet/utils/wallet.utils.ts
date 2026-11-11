export function maskAccountNumber(accountNumber: string | null): string {
  if (!accountNumber) return "Unavailable";
  return `•••• •••• ${accountNumber.slice(-4)}`;
}
