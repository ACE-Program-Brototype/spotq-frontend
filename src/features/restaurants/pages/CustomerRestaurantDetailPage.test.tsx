import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { toast } from "sonner";
import { customerRestaurantService } from "../services/customer-restaurant.service";
import type { CustomerRestaurantDetails } from "../types/customer-restaurant-details.types";
import CustomerRestaurantDetailPage from "./CustomerRestaurantDetailPage";

jest.mock("../services/customer-restaurant.service", () => ({
  customerRestaurantService: {
    getRestaurantDetails: jest.fn(),
  },
}));

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockRestaurantDetails: CustomerRestaurantDetails = {
  id: "rest-101",
  restaurantName: "Spice Symphony",
  description: "Authentic royal dining and Mughlai cuisine.",
  cuisineType: "North Indian, Mughlai",
  coverImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
  phone: "+91 98765 43210",
  email: "contact@spicesymphony.com",
  averageCost: 650,
  address: {
    id: "addr-1",
    addressLine1: "Connaught Place",
    addressLine2: "Inner Circle",
    city: "New Delhi",
    state: "Delhi",
    country: "India",
    pincode: "110001",
    latitude: 28.6315,
    longitude: 77.2167,
  },
  operatingHours: [
    { id: "h0", dayOfWeek: 0, isOpen: true, openTime: "11:00 AM", closeTime: "11:00 PM" },
    { id: "h1", dayOfWeek: 1, isOpen: true, openTime: "11:00 AM", closeTime: "11:00 PM" },
    { id: "h2", dayOfWeek: 2, isOpen: true, openTime: "11:00 AM", closeTime: "11:00 PM" },
    { id: "h3", dayOfWeek: 3, isOpen: true, openTime: "11:00 AM", closeTime: "11:00 PM" },
    { id: "h4", dayOfWeek: 4, isOpen: true, openTime: "11:00 AM", closeTime: "11:00 PM" },
    { id: "h5", dayOfWeek: 5, isOpen: true, openTime: "11:00 AM", closeTime: "11:00 PM" },
    { id: "h6", dayOfWeek: 6, isOpen: true, openTime: "11:00 AM", closeTime: "11:00 PM" },
  ],
  settings: {
    isOpened: true,
    isPreorder: true,
    acceptsQueue: true,
    acceptsQrOrders: true,
  },
  images: [],
  menu: [
    {
      id: "starters",
      name: "Starters",
      description: "Appetizers and quick bites",
      displayOrder: 1,
      items: [
        {
          id: "item-1",
          name: "Paneer Tikka",
          description: "Smoky cottage cheese cubes marinated in tandoori spices.",
          price: 280,
          preparationTime: 15,
          calories: 320,
          isVegetarian: true,
          isAvailable: true,
          isFeatured: false,
          variants: [],
          addons: [],
          images: [],
        },
      ],
    },
    {
      id: "main-course",
      name: "Main Course",
      description: "Rich curries and tandoori breads",
      displayOrder: 2,
      items: [
        {
          id: "item-2",
          name: "Paneer Butter Masala",
          description: "Rich and creamy tomato gravy with tender paneer.",
          price: 340,
          preparationTime: 20,
          calories: 450,
          isVegetarian: true,
          isAvailable: true,
          isFeatured: false,
          variants: [
            { id: "v1", name: "Half", price: 200, isDefault: false, isAvailable: true },
            { id: "v2", name: "Full", price: 340, isDefault: true, isAvailable: true },
          ],
          addons: [
            {
              id: "a1",
              addonId: "extra-butter",
              name: "Extra Butter",
              description: null,
              price: 30,
              imageKey: null,
              isAvailable: true,
            },
          ],
          images: [],
        },
      ],
    },
  ],
};

function renderWithProviders(initialEntry = "/restaurants/rest-101") {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialEntry]}>
        <Routes>
          <Route path="/restaurants/:restaurantId" element={<CustomerRestaurantDetailPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("CustomerRestaurantDetailPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
  });

  it("displays loading skeleton while query is in-flight", () => {
    (customerRestaurantService.getRestaurantDetails as jest.Mock).mockReturnValue(
      new Promise(() => {}),
    );

    renderWithProviders();

    // Verify skeleton animation placeholders are rendered
    expect(
      screen.getAllByRole("generic").some((el) => el.className.includes("animate-pulse")),
    ).toBe(true);
  });

  it("displays error state when restaurant details fetch fails", async () => {
    (customerRestaurantService.getRestaurantDetails as jest.Mock).mockRejectedValue(
      new Error("Network Error"),
    );

    renderWithProviders();

    await waitFor(() => {
      expect(
        screen.getByText(/We couldn't retrieve the details for this restaurant/i),
      ).toBeInTheDocument();
    });

    const retryBtn = screen.getByRole("button", { name: /try again/i });
    expect(retryBtn).toBeInTheDocument();

    (customerRestaurantService.getRestaurantDetails as jest.Mock).mockResolvedValue(
      mockRestaurantDetails,
    );
    fireEvent.click(retryBtn);

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "Spice Symphony" })).toBeInTheDocument();
    });
  });

  it("renders restaurant details, categories, items, and about section", async () => {
    (customerRestaurantService.getRestaurantDetails as jest.Mock).mockResolvedValue(
      mockRestaurantDetails,
    );

    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "Spice Symphony" })).toBeInTheDocument();
    });

    // Check document title
    expect(document.title).toBe("Spice Symphony | SpotQ");

    // Check Categories in Left Navigation
    expect(screen.getByRole("button", { name: "Starters" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Main Course" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Overview & Hours" })).toBeInTheDocument();

    // Check Menu Items
    expect(screen.getByRole("heading", { name: "Paneer Tikka" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Paneer Butter Masala" })).toBeInTheDocument();
    expect(screen.getByText("₹280.00")).toBeInTheDocument();
    expect(screen.getByText("₹340.00")).toBeInTheDocument();

    // Check Operating Hours and About Section
    expect(screen.getByRole("heading", { name: "About the Restaurant" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Operating Hours" })).toBeInTheDocument();
    expect(screen.getAllByText(/Authentic royal dining/i).length).toBeGreaterThanOrEqual(1);
  });

  it("handles category navigation click with smooth scrolling", async () => {
    (customerRestaurantService.getRestaurantDetails as jest.Mock).mockResolvedValue(
      mockRestaurantDetails,
    );

    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "Spice Symphony" })).toBeInTheDocument();
    });

    const startersBtn = screen.getByRole("button", { name: "Starters" });
    fireEvent.click(startersBtn);

    expect(window.HTMLElement.prototype.scrollIntoView).toHaveBeenCalledWith({
      behavior: "smooth",
      block: "start",
    });
  });

  it("opens customization modal and handles variant, addons, and quantity changes", async () => {
    (customerRestaurantService.getRestaurantDetails as jest.Mock).mockResolvedValue(
      mockRestaurantDetails,
    );

    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "Paneer Butter Masala" })).toBeInTheDocument();
    });

    // Paneer Butter Masala has variants, clicking Add to Cart opens customization modal
    const addButton = screen.getByRole("button", { name: /Add Paneer Butter Masala to cart/i });
    fireEvent.click(addButton);

    // Modal dialog is opened
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Item Customization")).toBeInTheDocument();

    // Select "Half" variant (₹200.00)
    const halfOption = screen.getByText("Half");
    fireEvent.click(halfOption);

    // Toggle "Extra Butter" addon (+₹30.00)
    const addonOption = screen.getByText("Extra Butter");
    fireEvent.click(addonOption);

    // Increase quantity using "+" stepper button
    const plusButton = screen.getByLabelText("Increase quantity");
    fireEvent.click(plusButton); // quantity = 2
    expect(screen.getByText("2")).toBeInTheDocument();

    // Total price: (₹200 variant + ₹30 addon) * 2 = ₹460.00
    const confirmBtn = screen.getByRole("button", { name: /Add to Cart.*460/i });
    expect(confirmBtn).toBeInTheDocument();

    fireEvent.click(confirmBtn);

    // Toast triggered and modal dismissed
    expect(toast.success).toHaveBeenCalledWith(
      "Added Paneer Butter Masala to cart!",
      expect.objectContaining({
        description: expect.stringContaining("₹460.00"),
      }),
    );

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("handles empty menu gracefully", async () => {
    (customerRestaurantService.getRestaurantDetails as jest.Mock).mockResolvedValue({
      ...mockRestaurantDetails,
      menu: [],
    });

    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "Spice Symphony" })).toBeInTheDocument();
    });

    expect(screen.getByText("Menu Coming Soon")).toBeInTheDocument();
    expect(screen.getByText("No categories available yet")).toBeInTheDocument();
  });
});
