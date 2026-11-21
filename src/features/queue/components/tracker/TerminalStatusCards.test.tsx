import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { CancelledStatusCard } from "./CancelledStatusCard";
import { SeatedStatusCard } from "./SeatedStatusCard";
import { SkippedStatusCard } from "./SkippedStatusCard";

describe("Terminal Queue Status Cards", () => {
  it("renders SeatedStatusCard with optional table number and restaurant menu link", () => {
    render(
      <MemoryRouter>
        <SeatedStatusCard
          restaurantId="rest-10"
          restaurantName="Bistro Lumiere"
          tableNumber="T-09"
        />
      </MemoryRouter>,
    );

    expect(screen.getByText("You are Seated!")).toBeInTheDocument();
    expect(screen.getByText(/Enjoy your dining experience at Bistro Lumiere/i)).toBeInTheDocument();
    expect(screen.getByText("Table Number: T-09")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /View Menu/i })).toHaveAttribute(
      "href",
      "/restaurants/rest-10",
    );
  });

  it("renders CancelledStatusCard with reason fallback and back link", () => {
    render(
      <MemoryRouter>
        <CancelledStatusCard restaurantId="rest-10" restaurantName="Bistro Lumiere" />
      </MemoryRouter>,
    );

    expect(screen.getByText("Queue Entry Cancelled")).toBeInTheDocument();
    expect(
      screen.getByText(/Your queue entry for Bistro Lumiere is no longer active/i),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Back to Restaurant/i })).toHaveAttribute(
      "href",
      "/restaurants/rest-10",
    );
  });

  it("renders SkippedStatusCard with custom reason and back link", () => {
    render(
      <MemoryRouter>
        <SkippedStatusCard
          restaurantId="rest-10"
          restaurantName="Bistro Lumiere"
          reason="Guest did not respond at host stand"
        />
      </MemoryRouter>,
    );

    expect(screen.getByText("Turn Skipped")).toBeInTheDocument();
    expect(screen.getByText("Guest did not respond at host stand")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Back to Restaurant/i })).toHaveAttribute(
      "href",
      "/restaurants/rest-10",
    );
  });
});
