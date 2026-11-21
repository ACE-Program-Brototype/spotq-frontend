import { render, screen } from "@testing-library/react";
import { CustomerPaymentStatusBadge } from "./CustomerPaymentStatusBadge";

describe("CustomerPaymentStatusBadge", () => {
  it("renders green SUCCESS badge for SUCCESS status", () => {
    render(<CustomerPaymentStatusBadge status="SUCCESS" />);
    const badge = screen.getByTestId("customer-payment-status-badge-success");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent("SUCCESS");
    expect(badge.className).toContain("text-emerald-700");
  });

  it("renders green SUCCESS badge for CAPTURED status", () => {
    render(<CustomerPaymentStatusBadge status="CAPTURED" />);
    const badge = screen.getByTestId("customer-payment-status-badge-success");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent("SUCCESS");
  });

  it("renders red FAILED badge for FAILED status", () => {
    render(<CustomerPaymentStatusBadge status="FAILED" />);
    const badge = screen.getByTestId("customer-payment-status-badge-failed");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent("FAILED");
    expect(badge.className).toContain("text-rose-700");
  });

  it("renders purple REFUNDED badge for REFUNDED status", () => {
    render(<CustomerPaymentStatusBadge status="REFUNDED" />);
    const badge = screen.getByTestId("customer-payment-status-badge-refunded");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent("REFUNDED");
    expect(badge.className).toContain("text-purple-700");
  });
});
