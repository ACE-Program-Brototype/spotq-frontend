import { fireEvent, render, screen } from "@testing-library/react";
import type { CustomerRestaurantDetails } from "../../types/customer-restaurant.types";
import { RestaurantMenuNavigation } from "./RestaurantMenuNavigation";

const baseRestaurant: CustomerRestaurantDetails = {
  restaurantId: "rest-1",
  restaurantName: "Al-Reem",
  phone: "6282973124",
  email: "test@example.com",
  description: "Test description",
  coverImage: "test.jpg",
  city: "Aluva",
  state: "Kerala",
  cuisineType: "Biryani",
  averageCost: 400,
  isOpened: true,
  isPreorder: true,
  acceptsQueue: true,
  address: {
    id: "addr-1",
    addressLine1: "Bank Junction",
    addressLine2: null,
    city: "Aluva",
    state: "Kerala",
    country: "India",
    pincode: "683101",
    latitude: 10.1,
    longitude: 76.3,
  },
  settings: {
    isOpened: true,
    isPreorder: true,
    acceptsQueue: true,
    acceptsQrOrders: true,
  },
  queue: {
    hasJoinedAnyQueue: null,
    hasJoinedThisRestaurantQueue: null,
    isGuestUser: true,
  },
  menu: [
    {
      id: "cat-1",
      name: "Main Course",
      displayOrder: 0,
      items: [],
    },
  ],
};

describe("RestaurantMenuNavigation", () => {
  it("renders Join Queue button when subscriptionType is QUEUE_PRO", () => {
    const onJoinQueueClick = jest.fn();
    const restaurant = {
      ...baseRestaurant,
      subscriptionType: "QUEUE_PRO",
    };

    render(
      <RestaurantMenuNavigation
        categories={restaurant.menu ?? []}
        restaurant={restaurant}
        activeId="cat-1"
        onActiveChange={jest.fn()}
        onJoinQueueClick={onJoinQueueClick}
      />,
    );

    const joinBtn = screen.getByRole("button", { name: /Join Queue/i });
    expect(joinBtn).toBeInTheDocument();
    expect(joinBtn).not.toBeDisabled();

    fireEvent.click(joinBtn);
    expect(onJoinQueueClick).toHaveBeenCalledTimes(1);
  });

  it("renders disabled button when queue is closed in settings", () => {
    const restaurant = {
      ...baseRestaurant,
      subscriptionType: "QUEUE_PRO",
      settings: {
        ...(baseRestaurant.settings ?? {
          isOpened: true,
          isPreorder: true,
          acceptsQueue: true,
          acceptsQrOrders: true,
        }),
        acceptsQueue: false,
      },
    };

    render(
      <RestaurantMenuNavigation
        categories={restaurant.menu ?? []}
        restaurant={restaurant}
        activeId="cat-1"
        onActiveChange={jest.fn()}
      />,
    );

    const joinBtn = screen.getByRole("button", { name: /Join Queue/i });
    expect(joinBtn).toBeDisabled();
  });

  it("does not render Join Queue button when restaurant is not QUEUE_PRO", () => {
    const restaurant = {
      ...baseRestaurant,
      subscriptionType: "SELF_PRO",
    };

    render(
      <RestaurantMenuNavigation
        categories={restaurant.menu ?? []}
        restaurant={restaurant}
        activeId="cat-1"
        onActiveChange={jest.fn()}
      />,
    );

    expect(screen.queryByRole("button", { name: /Join Queue/i })).not.toBeInTheDocument();
  });
});
