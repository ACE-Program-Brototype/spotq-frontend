import { render, screen } from "@testing-library/react";
import { EstimatedWaitChip } from "./EstimatedWaitChip";

describe("EstimatedWaitChip", () => {
  it("renders accurate labels for null, zero/negative, singular, and plural wait times", () => {
    const { rerender } = render(<EstimatedWaitChip estimatedWaitMinutes={null} />);
    expect(screen.getByText("Calculating wait time...")).toBeInTheDocument();

    rerender(<EstimatedWaitChip estimatedWaitMinutes={0} />);
    expect(screen.getByText("Table ready soon")).toBeInTheDocument();

    rerender(<EstimatedWaitChip estimatedWaitMinutes={1} />);
    expect(screen.getByText("~1 min remaining")).toBeInTheDocument();

    rerender(<EstimatedWaitChip estimatedWaitMinutes={14} />);
    expect(screen.getByText("~14 mins remaining")).toBeInTheDocument();
  });
});
