import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import type { RestaurantListItem, RestaurantStatusType } from "../types/restaurant.types";
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
    status: "REJECTED",
    is_subscription_active: false,
    is_blocked: false,
    created_at: "2026-09-11T09:00:00.000Z",
    updated_at: "2026-09-11T09:00:00.000Z",
  },
];

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
};

describe("RestaurantTable", () => {
  it("renders restaurant rows correctly with badges and contact details", () => {
    renderWithRouter(<RestaurantTable restaurants={mockRestaurants} />);

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
    expect(screen.getByText("REJECTED")).toBeInTheDocument();
    expect(screen.getByText("Inactive")).toBeInTheDocument();
  });

  it("renders Actions column and Details navigation buttons with correct paths", () => {
    renderWithRouter(<RestaurantTable restaurants={mockRestaurants} />);

    expect(screen.getByRole("columnheader", { name: /actions/i })).toBeInTheDocument();

    const link1 = screen.getByTestId("restaurant-details-btn-rest-1");
    expect(link1).toBeInTheDocument();
    expect(link1).toHaveAttribute("href", "/admin/restaurants/rest-1");

    const link2 = screen.getByTestId("restaurant-details-btn-rest-2");
    expect(link2).toBeInTheDocument();
    expect(link2).toHaveAttribute("href", "/admin/restaurants/rest-2");
  });

  it("calls onSort when a sortable column header is clicked", () => {
    const handleSort = jest.fn();
    renderWithRouter(
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

  it("normalizes lowercase status values properly in badges", () => {
    const lowercaseStatusRestaurants: RestaurantListItem[] = [
      {
        ...mockRestaurants[0],
        id: "rest-3",
        status: "active" as unknown as RestaurantStatusType,
      },
    ];

    renderWithRouter(<RestaurantTable restaurants={lowercaseStatusRestaurants} />);
    expect(screen.getByText("ACTIVE")).toBeInTheDocument();
  });

  it("truncates ID with ellipsis only when length exceeds 10 characters", () => {
    const mixedIdRestaurants: RestaurantListItem[] = [
      {
        ...mockRestaurants[0],
        id: "short-id",
      },
      {
        ...mockRestaurants[1],
        id: "very-long-restaurant-id-123456",
      },
    ];

    renderWithRouter(<RestaurantTable restaurants={mixedIdRestaurants} />);
    expect(screen.getByText("ID: short-id")).toBeInTheDocument();
    expect(screen.getByText("ID: very-long-...")).toBeInTheDocument();
  });
});
