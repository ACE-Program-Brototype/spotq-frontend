/**
 * Transaction Export Utilities
 * Generates RFC-4180 compliant CSV exports for payment transactions ledger.
 */

import { formatDate } from "@/lib/utils/date";
import { CSV_FORMULA_INJECTION_PREFIXES } from "../constants/transaction.constants";
import type { PaymentTransactionItem } from "../types/transaction.types";

export function escapeCsvField(field: unknown): string {
  if (field === null || field === undefined) {
    return "";
  }
  let str = String(field);

  // Prevent CSV Formula Injection (CWE-1236)
  if (CSV_FORMULA_INJECTION_PREFIXES.some((prefix) => str.startsWith(prefix))) {
    str = `'${str}`;
  }

  if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function generateTransactionsCsvString(
  transactions: readonly PaymentTransactionItem[],
): string {
  const headers = [
    "Date & Time",
    "Transaction ID",
    "Order Number",
    "Customer Name",
    "Payment Method",
    "Amount (INR)",
    "Status",
    "Settlement Status",
    "Razorpay Payment ID",
  ];

  const rows = transactions.map((tx) => [
    formatDate(tx.createdAt),
    tx.id,
    tx.orderNumber,
    tx.customerName,
    tx.paymentMethod,
    (tx.amountPaise / 100).toFixed(2),
    tx.status,
    tx.settlementStatus,
    tx.razorpayPaymentId || "",
  ]);

  const headerRow = headers.map(escapeCsvField).join(",");
  const dataRows = rows.map((row) => row.map(escapeCsvField).join(","));

  return [headerRow, ...dataRows].join("\r\n");
}

export function downloadTransactionsCsv(
  transactions: readonly PaymentTransactionItem[],
  filenamePrefix = "transactions-export",
): boolean {
  if (!transactions || transactions.length === 0) {
    return false;
  }

  const csvContent = generateTransactionsCsvString(transactions);
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const timestamp = new Date().toISOString().slice(0, 10);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${filenamePrefix}-${timestamp}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return true;
}
