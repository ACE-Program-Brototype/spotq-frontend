import { render, screen } from "@testing-library/react";
import { InvoiceStatusBadge } from "./InvoiceStatusBadge";

describe("InvoiceStatusBadge", () => {
  it("renders success badge with correct text and testid", () => {
    render(<InvoiceStatusBadge status="SUCCESS" />);
    const badge = screen.getByTestId("invoice-status-badge-success");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent("Success");
  });

  it("renders failed badge with correct text and testid", () => {
    render(<InvoiceStatusBadge status="FAILED" />);
    const badge = screen.getByTestId("invoice-status-badge-failed");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent("Failed");
  });

  it("renders created/incomplete badge with correct text and testid", () => {
    render(<InvoiceStatusBadge status="CREATED" />);
    const badge = screen.getByTestId("invoice-status-badge-created");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent("Incomplete");
  });

  it("falls back to created/incomplete for unexpected status", () => {
    render(<InvoiceStatusBadge status="UNKNOWN_STATUS" />);
    const badge = screen.getByTestId("invoice-status-badge-created");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent("Incomplete");
  });

  it("renders without icon when showIcon is false", () => {
    const { container } = render(<InvoiceStatusBadge status="SUCCESS" showIcon={false} />);
    expect(container.querySelector("svg")).not.toBeInTheDocument();
  });
});
