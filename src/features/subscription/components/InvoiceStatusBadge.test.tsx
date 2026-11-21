import { render, screen } from "@testing-library/react";
import { InvoiceStatusBadge } from "@/features/subscription/components/InvoiceStatusBadge";

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

  it("renders neutral fallback badge for unhandled or unknown status", () => {
    render(<InvoiceStatusBadge status="UNKNOWN_STATUS" />);
    const badge = screen.getByTestId("invoice-status-badge-default");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent("UNKNOWN_STATUS");
  });

  it("renders UNKNOWN fallback text when status is empty", () => {
    render(<InvoiceStatusBadge status="" />);
    const badge = screen.getByTestId("invoice-status-badge-default");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent("UNKNOWN");
  });

  it("renders without icon when showIcon is false", () => {
    const { container } = render(<InvoiceStatusBadge status="SUCCESS" showIcon={false} />);
    expect(container.querySelector("svg")).not.toBeInTheDocument();
  });
});
