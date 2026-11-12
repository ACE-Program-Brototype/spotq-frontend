import { render, screen } from "@testing-library/react";
import { QueueProgressBar } from "./QueueProgressBar";

describe("QueueProgressBar", () => {
  it("renders 100% when currentPosition is 1", () => {
    render(<QueueProgressBar currentPosition={1} initialPosition={10} />);
    expect(screen.getByText("100%")).toBeInTheDocument();
  });

  it("calculates progress percentage between 10% and 95% for waiting positions", () => {
    const { rerender } = render(<QueueProgressBar currentPosition={3} initialPosition={4} />);
    expect(screen.getByText("50%")).toBeInTheDocument();

    rerender(<QueueProgressBar currentPosition={20} initialPosition={20} />);
    expect(screen.getByText("10%")).toBeInTheDocument();

    rerender(<QueueProgressBar currentPosition={2} initialPosition={100} />);
    expect(screen.getByText("95%")).toBeInTheDocument();
  });

  it("renders 0% when currentPosition is null or non-positive instead of coercing null <= 1", () => {
    const { rerender } = render(<QueueProgressBar currentPosition={null} initialPosition={5} />);
    expect(screen.getByText("0%")).toBeInTheDocument();

    rerender(<QueueProgressBar currentPosition={0} initialPosition={5} />);
    expect(screen.getByText("0%")).toBeInTheDocument();
  });
});
