import { render, screen } from "@testing-library/react";
import { TransactionStatusBadge } from "./TransactionStatusBadge";

describe("TransactionStatusBadge", () => {
  it("renders success badge with correct label and testid", () => {
    render(<TransactionStatusBadge status="SUCCESS" />);
    expect(screen.getByTestId("transaction-status-badge-success")).toBeInTheDocument();
    expect(screen.getByText("Success")).toBeInTheDocument();
  });

  it("renders pending badge with correct label and testid", () => {
    render(<TransactionStatusBadge status="PENDING" />);
    expect(screen.getByTestId("transaction-status-badge-pending")).toBeInTheDocument();
    expect(screen.getByText("Pending")).toBeInTheDocument();
  });

  it("renders failed badge with correct label and testid", () => {
    render(<TransactionStatusBadge status="FAILED" />);
    expect(screen.getByTestId("transaction-status-badge-failed")).toBeInTheDocument();
    expect(screen.getByText("Failed")).toBeInTheDocument();
  });

  it("renders refunded badge with correct label and testid", () => {
    render(<TransactionStatusBadge status="REFUNDED" />);
    expect(screen.getByTestId("transaction-status-badge-refunded")).toBeInTheDocument();
    expect(screen.getByText("Refunded")).toBeInTheDocument();
  });

  it("falls back to default badge for unrecognized status", () => {
    render(<TransactionStatusBadge status="OTHER_STATUS" />);
    expect(screen.getByText("OTHER_STATUS")).toBeInTheDocument();
  });
});
