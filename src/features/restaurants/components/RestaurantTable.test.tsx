import { fireEvent, render, screen } from "@testing-library/react";
import type { RestaurantListItem } from "../types/restaurant.types";
import { RestaurantTable } from "./RestaurantTable";

const mockRestaurants: RestaurantListItem[] = [
  {
    id: "rest-1",
    restaurant_name: "Ajex Grand Bistro",
    owner_name: "Ajex Joshy",
    contact: {
      email: "ajex@example.com",
      phone: "+919876543210",
      owner_email: "ajex@example.com",
    },
    plan: "QUEUE_PRO",
    status: "APPROVED",
    is_subscription_active: true,
    is_blocked: false,
    created_at: "2026-09-10T12:00:00.000Z",
    updated_at: "2026-09-11T14:30:00.000Z",
  },
  {
    id: "rest-2",
    restaurant_name: "Downtown Cafe",
    owner_name: "Sarah Connor",
    contact: {
      email: "sarah@cafe.com",
      phone: null,
      owner_email: "sarah@cafe.com",
    },
    plan: "SELF_SERVICE_PRO",
    status: "PENDING",
    is_subscription_active: false,
    is_blocked: false,
    created_at: "2026-09-11T09:00:00.000Z",
    updated_at: "2026-09-11T09:00:00.000Z",
  },
];

describe("RestaurantTable", () => {
  it("renders restaurant rows correctly with badges and contact details", () => {
    render(<RestaurantTable restaurants={mockRestaurants} />);

    expect(screen.getByText("Ajex Grand Bistro")).toBeInTheDocument();
    expect(screen.getByText("Ajex Joshy")).toBeInTheDocument();
    expect(screen.getByText("ajex@example.com")).toBeInTheDocument();
    expect(screen.getByText("+919876543210")).toBeInTheDocument();
    expect(screen.getByText("Queue Pro")).toBeInTheDocument();
    expect(screen.getByText("APPROVED")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();

    expect(screen.getByText("Downtown Cafe")).toBeInTheDocument();
    expect(screen.getByText("Sarah Connor")).toBeInTheDocument();
    expect(screen.getByText("sarah@cafe.com")).toBeInTheDocument();
    expect(screen.getByText("Self Service Pro")).toBeInTheDocument();
    expect(screen.getByText("PENDING")).toBeInTheDocument();
    expect(screen.getByText("Inactive")).toBeInTheDocument();
  });

  it("calls onSort when a sortable column header is clicked", () => {
    const handleSort = jest.fn();
    render(
      <RestaurantTable
        restaurants={mockRestaurants}
        sortBy="created_at"
        sortOrder="desc"
        onSort={handleSort}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /restaurant/i }));
    expect(handleSort).toHaveBeenCalledWith("restaurant_name");

    fireEvent.click(screen.getByRole("button", { name: /owner & contact/i }));
    expect(handleSort).toHaveBeenCalledWith("owner_name");
  });
});
