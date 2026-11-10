import { render, screen } from "@testing-library/react";
import { ContextBanner } from "./ContextBanner";

describe("ContextBanner", () => {
  it("renders restaurant name and Direct Kitchen Sync badge", () => {
    render(<ContextBanner restaurantName="Spice Garden Cafe" />);

    expect(screen.getByText("Ordering from Spice Garden Cafe")).toBeInTheDocument();
    expect(screen.getByText("Direct Kitchen Sync")).toBeInTheDocument();
    expect(screen.getByText(/PCI-DSS Secure Prepay/i)).toBeInTheDocument();
  });

  it("renders Table badge when tableNumber is provided", () => {
    render(<ContextBanner restaurantName="Spice Garden Cafe" tableNumber={4} />);

    expect(screen.getByText("Table 4")).toBeInTheDocument();
  });

  it("renders fallback heading when restaurantName is omitted", () => {
    render(<ContextBanner />);

    expect(screen.getByText("Direct Kitchen Order")).toBeInTheDocument();
  });
});
