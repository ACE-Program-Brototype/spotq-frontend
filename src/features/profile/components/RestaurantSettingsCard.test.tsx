import { fireEvent, render, screen } from "@testing-library/react";
import { useUpdateRestaurantProfile } from "../hooks/use-update-restaurant-profile";
import type {
  RestaurantProfileData,
  RestaurantSettingsDetails,
} from "../types/restaurant-profile.types";
import { RestaurantSettingsCard } from "./RestaurantSettingsCard";

jest.mock("../hooks/use-update-restaurant-profile");

const mockUseUpdateRestaurantProfile = useUpdateRestaurantProfile as jest.MockedFunction<
  typeof useUpdateRestaurantProfile
>;

const mockSettings: RestaurantSettingsDetails = {
  acceptsQueue: true,
  acceptsQrOrders: true,
  loyaltyEnabled: false,
  autoAcceptQueue: false,
  seatingCapacity: 50,
};

const mockFullData: RestaurantProfileData = {
  restaurant: {
    name: "Mandi Central",
    phone: "+919876543210",
    ownerName: "Sarah Connor",
  },
  profile: {
    logo: "https://example.com/logo.png",
    coverImage: "https://example.com/cover.jpg",
    description: "Specializing in traditional Mandi.",
    cuisineType: "Arabian",
    averageCost: 800,
  },
  settings: mockSettings,
  businessHours: [
    {
      dayOfWeek: 1,
      openTime: "11:00",
      closeTime: "23:00",
      isClosed: false,
    },
  ],
};

describe("RestaurantSettingsCard Component", () => {
  const mockMutate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseUpdateRestaurantProfile.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    } as unknown as ReturnType<typeof useUpdateRestaurantProfile>);
  });

  it("renders read-only settings view initially with seating capacity", () => {
    render(<RestaurantSettingsCard settings={mockSettings} fullData={mockFullData} />);

    expect(screen.getByText("Restaurant Settings")).toBeInTheDocument();
    expect(screen.getByText("50 seats")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /edit settings/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /save settings/i })).not.toBeInTheDocument();
  });

  it("enters edit mode and disables save button when form is clean (AC23)", () => {
    render(<RestaurantSettingsCard settings={mockSettings} fullData={mockFullData} />);

    fireEvent.click(screen.getByRole("button", { name: /edit settings/i }));

    const saveButton = screen.getByRole("button", { name: /save settings/i });
    expect(saveButton).toBeInTheDocument();
    expect(saveButton).toBeDisabled();
    expect(screen.getByLabelText("Seating Capacity")).toHaveValue(50);
  });

  it("enables save button when seating capacity is updated and disables when invalid", () => {
    render(<RestaurantSettingsCard settings={mockSettings} fullData={mockFullData} />);

    fireEvent.click(screen.getByRole("button", { name: /edit settings/i }));

    const saveButton = screen.getByRole("button", { name: /save settings/i });
    expect(saveButton).toBeDisabled();

    const capacityInput = screen.getByLabelText("Seating Capacity");
    fireEvent.change(capacityInput, { target: { value: "80" } });

    expect(saveButton).not.toBeDisabled();

    // Set invalid seating capacity (<1)
    fireEvent.change(capacityInput, { target: { value: "0" } });
    expect(screen.getByText("Seating capacity must be at least 1")).toBeInTheDocument();
    expect(saveButton).toBeDisabled();
  });

  it("submits updated payload when dirty form is saved", () => {
    render(<RestaurantSettingsCard settings={mockSettings} fullData={mockFullData} />);

    fireEvent.click(screen.getByRole("button", { name: /edit settings/i }));

    // Toggle Loyalty Enabled from false to true
    const loyaltySwitch = screen.getByLabelText("Loyalty Enabled");
    fireEvent.click(loyaltySwitch);

    // Update seating capacity to 100
    const capacityInput = screen.getByLabelText("Seating Capacity");
    fireEvent.change(capacityInput, { target: { value: "100" } });

    const saveButton = screen.getByRole("button", { name: /save settings/i });
    expect(saveButton).not.toBeDisabled();

    fireEvent.click(saveButton);

    expect(mockMutate).toHaveBeenCalledTimes(1);
    expect(mockMutate).toHaveBeenCalledWith(
      {
        restaurant: mockFullData.restaurant,
        profile: {
          description: mockFullData.profile.description,
          cuisineType: mockFullData.profile.cuisineType,
          averageCost: mockFullData.profile.averageCost,
        },
        settings: {
          acceptsQueue: true,
          acceptsQrOrders: true,
          loyaltyEnabled: true,
          autoAcceptQueue: false,
          seatingCapacity: 100,
        },
        businessHours: [
          {
            dayOfWeek: 1,
            openTime: "11:00",
            closeTime: "23:00",
            isClosed: false,
          },
        ],
      },
      expect.objectContaining({
        onSuccess: expect.any(Function),
      }),
    );
  });

  it("resets edit state when cancel button is clicked", () => {
    render(<RestaurantSettingsCard settings={mockSettings} fullData={mockFullData} />);

    fireEvent.click(screen.getByRole("button", { name: /edit settings/i }));

    // Update seating capacity
    const capacityInput = screen.getByLabelText("Seating Capacity");
    fireEvent.change(capacityInput, { target: { value: "120" } });

    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));

    expect(screen.getByRole("button", { name: /edit settings/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /save settings/i })).not.toBeInTheDocument();
    expect(screen.getByText("50 seats")).toBeInTheDocument();
  });
});
