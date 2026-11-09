import { render, screen } from "@testing-library/react";
import { ResponseCountdownBadge } from "./ResponseCountdownBadge";

describe("ResponseCountdownBadge", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders nothing when deadline is null", () => {
    const { container } = render(<ResponseCountdownBadge deadline={null} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders active countdown when deadline is in the future", () => {
    const now = Date.now();
    jest.setSystemTime(now);

    const deadline = new Date(now + 125_000).toISOString(); // 2 minutes 5 seconds
    render(<ResponseCountdownBadge deadline={deadline} />);

    expect(screen.getByTestId("countdown-active")).toBeInTheDocument();
    expect(screen.getByText("2:05")).toBeInTheDocument();
  });

  it("renders expired badge when deadline is in the past", () => {
    const now = Date.now();
    jest.setSystemTime(now);

    const deadline = new Date(now - 10_000).toISOString();
    render(<ResponseCountdownBadge deadline={deadline} />);

    expect(screen.getByTestId("countdown-expired")).toBeInTheDocument();
    expect(screen.getByText("Expired")).toBeInTheDocument();
  });
});
