import { render, screen } from "@testing-library/react";
import { ContextBanner } from "./ContextBanner";

describe("ContextBanner", () => {
  it("renders restaurant name and Takeaway badge", () => {
    render(<ContextBanner restaurantName="Spice Garden Cafe" />);

    expect(screen.getByText("Spice Garden Cafe")).toBeInTheDocument();
    expect(screen.getByText("Takeaway")).toBeInTheDocument();
  });

  it("renders takeaway context with restaurant name", () => {
    render(<ContextBanner restaurantName="Spice Garden Cafe" />);

    expect(screen.getByText(/Takeaway from/i)).toBeInTheDocument();
    expect(screen.getByText("Spice Garden Cafe")).toBeInTheDocument();
  });

  it("renders nothing when restaurantName is omitted", () => {
    const { container } = render(<ContextBanner />);

    expect(container.firstChild).toBeNull();
  });
});
