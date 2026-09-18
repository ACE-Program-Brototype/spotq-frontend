import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useRestaurantProfile } from "../hooks/use-restaurant-profile";
import type { RestaurantProfileData } from "../types/restaurant-profile.types";
import RestaurantProfilePage from "./RestaurantProfilePage";

jest.mock("../hooks/use-restaurant-profile");

const mockUseRestaurantProfile = useRestaurantProfile as jest.MockedFunction<
  typeof useRestaurantProfile
>;

const mockData: RestaurantProfileData = {
  restaurant: {
    name: "Mandi Central",
    phone: "+919876543210",
    ownerName: "Sarah Connor",
  },
  profile: {
    logo: "https://example.com/logo.png",
    coverImage: "https://example.com/cover.jpg",
    description: "Specializing in traditional Arabian Mandi and grills.",
    cuisineType: "Arabian / Middle Eastern",
    averageCost: 800,
  },
  settings: {
    acceptsQueue: true,
    acceptsQrOrders: true,
    loyaltyEnabled: false,
    autoAcceptQueue: false,
    seatingCapacity: 50,
  },
  businessHours: [
    {
      dayOfWeek: 1,
      openTime: "11:00",
      closeTime: "23:00",
      isClosed: false,
    },
    {
      dayOfWeek: 7,
      openTime: null,
      closeTime: null,
      isClosed: true,
    },
  ],
};

const renderWithProviders = (ui: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>,
  );
};

describe("RestaurantProfilePage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state", () => {
    mockUseRestaurantProfile.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
      refetch: jest.fn(),
      isFetching: false,
    } as unknown as ReturnType<typeof useRestaurantProfile>);

    renderWithProviders(<RestaurantProfilePage />);

    expect(screen.getAllByText("Restaurant Profile")[0]).toBeInTheDocument();
  });

  it("renders error state with retry functionality", () => {
    const mockRefetch = jest.fn();
    mockUseRestaurantProfile.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error("Failed to fetch profile"),
      refetch: mockRefetch,
      isFetching: false,
    } as unknown as ReturnType<typeof useRestaurantProfile>);

    renderWithProviders(<RestaurantProfilePage />);

    expect(screen.getByText("Failed to load restaurant profile")).toBeInTheDocument();
    expect(screen.getByText("Failed to fetch profile")).toBeInTheDocument();

    const retryBtn = screen.getByRole("button", { name: /retry loading/i });
    fireEvent.click(retryBtn);
    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });

  it("renders full profile details on successful query execution", () => {
    mockUseRestaurantProfile.mockReturnValue({
      data: mockData,
      isLoading: false,
      isError: false,
      error: null,
      refetch: jest.fn(),
      isFetching: false,
    } as unknown as ReturnType<typeof useRestaurantProfile>);

    renderWithProviders(<RestaurantProfilePage />);

    expect(screen.getAllByText("Restaurant Profile")[0]).toBeInTheDocument();
    expect(screen.getByText("Mandi Central")).toBeInTheDocument();
    expect(screen.getByText("+919876543210")).toBeInTheDocument();
    expect(screen.getByText("Sarah Connor")).toBeInTheDocument();

    expect(screen.getByText("Arabian / Middle Eastern")).toBeInTheDocument();
    expect(screen.getByText("₹800")).toBeInTheDocument();
    expect(
      screen.getByText("Specializing in traditional Arabian Mandi and grills."),
    ).toBeInTheDocument();

    expect(screen.getByText("Accepts Queue")).toBeInTheDocument();
    expect(screen.getByText("Accepts QR Orders")).toBeInTheDocument();

    expect(screen.getByText("Monday")).toBeInTheDocument();
    expect(screen.getByText("11:00 AM - 11:00 PM")).toBeInTheDocument();
    expect(screen.getByText("Sunday")).toBeInTheDocument();
  });
});
