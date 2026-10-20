import { formatCurrency } from "@/lib/utils/currency";
import { formatDate } from "@/lib/utils/date";
import type { OrderReceipt } from "../types/order-receipt.types";

export function generateReceiptText(receipt: OrderReceipt): string {
  const line = "-".repeat(42);
  const doubleLine = "=".repeat(42);
  const itemsText = receipt.items
    .map((item) => {
      const variantStr = item.variant_name ? `  Size: ${item.variant_name}\n` : "";
      const addonsStr =
        item.addons && item.addons.length > 0
          ? `  Add-ons: ${item.addons.map((a) => `${a.name} (+${formatCurrency(a.price)})`).join(", ")}\n`
          : "";
      const noteStr = item.special_instructions ? `  Note: ${item.special_instructions}\n` : "";

      return `${item.quantity}x ${item.name} - ${formatCurrency(item.line_total)}\n${variantStr}${addonsStr}${noteStr}`;
    })
    .join("\n");

  return [
    doubleLine,
    "              SPOTQ DIGITAL RECEIPT       ",
    doubleLine,
    `Restaurant: ${receipt.restaurant.name}`,
    `Order Number: #${receipt.order_number}`,
    `Order ID: ${receipt.order_id}`,
    `Date: ${formatDate(receipt.created_at)}`,
    `Status: ${receipt.status}`,
    line,
    "ITEMIZED DETAILS",
    line,
    itemsText,
    line,
    `Subtotal:     ${formatCurrency(receipt.sub_total)}`,
    `GST & Taxes:  ${formatCurrency(receipt.tax_amount)}`,
    `Platform Fee: ${formatCurrency(receipt.platform_fee)}`,
    doubleLine,
    `GRAND TOTAL:  ${formatCurrency(receipt.total_amount)}`,
    doubleLine,
    "       Thank you for ordering with SpotQ!   ",
    doubleLine,
  ].join("\n");
}

export function downloadReceiptAsText(receipt: OrderReceipt): void {
  const content = generateReceiptText(receipt);
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `SpotQ_Receipt_${receipt.order_number}.txt`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

export function generateReceiptHtml(receipt: OrderReceipt): string {
  const itemsHtml = receipt.items
    .map((item) => {
      const variantHtml = item.variant_name
        ? `<div style="font-size:12px;color:#6b7280;">Size: ${item.variant_name}</div>`
        : "";
      const addonsHtml =
        item.addons && item.addons.length > 0
          ? `<div style="font-size:12px;color:#6b7280;">Add-ons: ${item.addons.map((a) => `${a.name} (+${formatCurrency(a.price)})`).join(", ")}</div>`
          : "";
      const noteHtml = item.special_instructions
        ? `<div style="font-size:12px;color:#f97316;">Note: ${item.special_instructions}</div>`
        : "";

      return `
        <tr style="border-bottom: 1px solid #f3f4f6;">
          <td style="padding: 10px 0; vertical-align: top;">
            <div style="font-weight: 600; color: #111827;">${item.quantity}x ${item.name}</div>
            ${variantHtml}
            ${addonsHtml}
            ${noteHtml}
          </td>
          <td style="padding: 10px 0; text-align: right; vertical-align: top; font-weight: 600; color: #111827;">
            ${formatCurrency(item.line_total)}
          </td>
        </tr>
      `;
    })
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Receipt #${receipt.order_number} - ${receipt.restaurant.name}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f9fafb; padding: 24px; color: #111827; }
    .card { max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e5e7eb; padding: 24px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
    .badge { display: inline-block; padding: 2px 10px; border-radius: 9999px; font-size: 11px; font-weight: 700; background: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; }
    table { width: 100%; border-collapse: collapse; margin-top: 12px; }
    .row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; color: #4b5563; }
    .total-row { display: flex; justify-content: space-between; padding: 12px 0 0 0; font-size: 18px; font-weight: 700; color: #111827; border-top: 2px dashed #e5e7eb; margin-top: 10px; }
  </style>
</head>
<body>
  <div class="card">
    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
      <div>
        <h2 style="margin: 0 0 4px 0; font-size: 20px; font-weight: 700;">${receipt.restaurant.name}</h2>
        <div style="font-size: 13px; color: #6b7280;">Order #${receipt.order_number}</div>
        <div style="font-size: 12px; color: #9ca3af; margin-top: 2px;">${formatDate(receipt.created_at)}</div>
      </div>
      <span class="badge">${receipt.status}</span>
    </div>

    <div style="font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; margin-top: 20px;">
      Itemized Bill
    </div>
    <table>
      <tbody>
        ${itemsHtml}
      </tbody>
    </table>

    <div style="margin-top: 16px; border-top: 1px solid #e5e7eb; padding-top: 12px;">
      <div class="row"><span>Item Subtotal</span><span>${formatCurrency(receipt.sub_total)}</span></div>
      <div class="row"><span>GST & Taxes (5%)</span><span>${formatCurrency(receipt.tax_amount)}</span></div>
      <div class="row"><span>Platform Fee</span><span>${formatCurrency(receipt.platform_fee)}</span></div>
      <div class="total-row"><span>Total Paid</span><span>${formatCurrency(receipt.total_amount)}</span></div>
    </div>

    <div style="text-align: center; margin-top: 24px; font-size: 12px; color: #9ca3af;">
      Official SpotQ Digital Receipt
    </div>
  </div>
</body>
</html>`;
}

export function downloadReceiptAsHtml(receipt: OrderReceipt): void {
  const content = generateReceiptHtml(receipt);
  const blob = new Blob([content], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `SpotQ_Receipt_${receipt.order_number}.html`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
