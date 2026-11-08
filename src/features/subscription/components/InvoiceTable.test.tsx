import { fireEvent, render, screen } from "@testing-library/react";
import type { SubscriptionBillingTransactionItem } from "../types/subscription-history.types";
import { InvoiceTable } from "./InvoiceTable";

const mockTransactions: SubscriptionBillingTransactionItem[] = [
  {
    id: "tx-1",
    planCode: "QUEUE_PRO",
    planName: "SpotQ Queue Pro",
    billingCycle: "MONTHLY",
    amountPaise: 199900,
    amountRupees: 1999,
    currency: "INR",
    status: "SUCCESS",
    razorpayPaymentId: "pay_123",
    invoiceNumber: "INV-2026-0001",
    invoiceUrl: "https://s3.amazonaws.com/invoice1.pdf",
    createdAt: "2026-11-08T10:30:00Z",
  },
  {
    id: "tx-2",
    planCode: "QUEUE_PRO_YEARLY",
    planName: "SpotQ Queue Pro Yearly",
    billingCycle: "YEARLY",
    amountPaise: 1999000,
    amountRupees: 19990,
    currency: "INR",
    status: "FAILED",
    razorpayPaymentId: null,
    invoiceNumber: null,
    invoiceUrl: null,
    createdAt: "2026-11-01T08:15:00Z",
  },
];

describe("InvoiceTable", () => {
  it("renders loading skeletons when isLoading is true", () => {
    render(
      <InvoiceTable
        transactions={[]}
        isLoading={true}
        isFiltered={false}
        onResetFilter={jest.fn()}
      />,
    );

    expect(screen.getByTestId("invoice-table-loading")).toBeInTheDocument();
  });

  it("renders empty state when there are no transactions and not filtered", () => {
    render(
      <InvoiceTable
        transactions={[]}
        isLoading={false}
        isFiltered={false}
        onResetFilter={jest.fn()}
      />,
    );

    expect(screen.getByTestId("invoice-table-empty")).toBeInTheDocument();
    expect(screen.getByText("No billing transactions yet")).toBeInTheDocument();
  });

  it("renders filter empty state and reset button when filtered with zero results", () => {
    const handleReset = jest.fn();
    render(
      <InvoiceTable
        transactions={[]}
        isLoading={false}
        isFiltered={true}
        onResetFilter={handleReset}
      />,
    );

    expect(screen.getByTestId("invoice-table-filter-empty")).toBeInTheDocument();
    expect(screen.getByText("No matching transactions")).toBeInTheDocument();

    const resetBtn = screen.getByTestId("reset-filter-button");
    fireEvent.click(resetBtn);
    expect(handleReset).toHaveBeenCalledTimes(1);
  });

  it("renders rows for all transactions with properly formatted data", () => {
    render(
      <InvoiceTable
        transactions={mockTransactions}
        isLoading={false}
        isFiltered={false}
        onResetFilter={jest.fn()}
      />,
    );

    expect(screen.getByTestId("invoice-table")).toBeInTheDocument();
    expect(screen.getByTestId("invoice-row-tx-1")).toBeInTheDocument();
    expect(screen.getByTestId("invoice-row-tx-2")).toBeInTheDocument();

    expect(screen.getByText("SpotQ Queue Pro")).toBeInTheDocument();
    expect(screen.getByText("QUEUE_PRO")).toBeInTheDocument();
    expect(screen.getByText("INV-2026-0001")).toBeInTheDocument();
    expect(screen.getByText("Monthly")).toBeInTheDocument();
    expect(screen.getByText("Yearly")).toBeInTheDocument();

    // Check status badges
    expect(screen.getByTestId("invoice-status-badge-success")).toBeInTheDocument();
    expect(screen.getByTestId("invoice-status-badge-failed")).toBeInTheDocument();

    // Check download button vs disabled
    expect(screen.getByTestId("download-invoice-button")).toBeInTheDocument();
    expect(screen.getByTestId("download-invoice-button-disabled")).toBeInTheDocument();
  });
});
