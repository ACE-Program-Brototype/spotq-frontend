import { render, screen } from "@testing-library/react";
import { CircularPositionBadge } from "./CircularPositionBadge";

describe("CircularPositionBadge", () => {
  it("renders 1st position with green 'You're Next!' badge", () => {
    render(<CircularPositionBadge position={1} peopleAhead={0} />);

    expect(screen.getByText("1st")).toBeInTheDocument();
    expect(screen.getByText("You're Next!")).toBeInTheDocument();
    expect(screen.getByText(/Please be ready near the host stand/i)).toBeInTheDocument();
  });

  it("formats ordinal suffixes accurately including teens and twenties", () => {
    const { rerender } = render(<CircularPositionBadge position={2} peopleAhead={1} />);
    expect(screen.getByText("2nd")).toBeInTheDocument();
    expect(screen.getByText(/1/)).toBeInTheDocument();
    expect(screen.getByText(/party ahead of you/i)).toBeInTheDocument();

    rerender(<CircularPositionBadge position={3} />);
    expect(screen.getByText("3rd")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText(/parties ahead of you/i)).toBeInTheDocument();

    rerender(<CircularPositionBadge position={11} />);
    expect(screen.getByText("11th")).toBeInTheDocument();

    rerender(<CircularPositionBadge position={12} />);
    expect(screen.getByText("12th")).toBeInTheDocument();

    rerender(<CircularPositionBadge position={13} />);
    expect(screen.getByText("13th")).toBeInTheDocument();

    rerender(<CircularPositionBadge position={21} />);
    expect(screen.getByText("21st")).toBeInTheDocument();
  });

  it("derives peopleAhead from position when omitted from backend snapshot", () => {
    render(<CircularPositionBadge position={5} />);

    expect(screen.getByText("5th")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText(/parties ahead of you/i)).toBeInTheDocument();
  });

  it("renders fallback state safely when position is null or zero", () => {
    const { rerender } = render(<CircularPositionBadge position={null} />);
    expect(screen.getByText("—")).toBeInTheDocument();
    expect(screen.getByText(/Updating queue position/i)).toBeInTheDocument();
    expect(screen.queryByText(/ahead of you/i)).not.toBeInTheDocument();

    rerender(<CircularPositionBadge position={0} />);
    expect(screen.getByText("—")).toBeInTheDocument();
    expect(screen.queryByText("You're Next!")).not.toBeInTheDocument();
  });
});
