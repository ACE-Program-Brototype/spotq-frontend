export function maskAccountNumber(accountNumber: string): string {
  return `•••• •••• ${accountNumber.slice(-4)}`;
}
