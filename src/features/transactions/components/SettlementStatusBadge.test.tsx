import { render, screen } from "@testing-library/react";
import { SettlementStatusBadge } from "./SettlementStatusBadge";

describe("SettlementStatusBadge", () => {
  it("renders SETTLED badge correctly", () => {
    render(<SettlementStatusBadge status="SETTLED" />);
    expect(screen.getByTestId("settlement-status-badge-settled")).toBeInTheDocument();
    expect(screen.getByText("Settled")).toBeInTheDocument();
  });

  it("renders PENDING_EOD badge correctly", () => {
    render(<SettlementStatusBadge status="PENDING_EOD" />);
    expect(screen.getByTestId("settlement-status-badge-pending-eod")).toBeInTheDocument();
    expect(screen.getByText("Pending EOD")).toBeInTheDocument();
  });

  it("renders DEDUCTED_EOD badge correctly", () => {
    render(<SettlementStatusBadge status="DEDUCTED_EOD" />);
    expect(screen.getByTestId("settlement-status-badge-deducted-eod")).toBeInTheDocument();
    expect(screen.getByText("Deducted EOD")).toBeInTheDocument();
  });

  it("renders N/A for null or unknown status", () => {
    render(<SettlementStatusBadge status="" />);
    expect(screen.getByText("N/A")).toBeInTheDocument();
  });
});
