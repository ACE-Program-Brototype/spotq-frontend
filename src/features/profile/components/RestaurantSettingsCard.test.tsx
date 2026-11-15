import { fireEvent, render, screen } from "@testing-library/react";
import { PROFILE_MESSAGES } from "@/features/profile/constants/profile.constants";
import { useUpdateRestaurantProfile } from "@/features/profile/hooks/use-update-restaurant-profile";
import type {
  RestaurantProfileData,
  RestaurantSettingsDetails,
} from "@/features/profile/types/restaurant-profile.types";
import { RestaurantSettingsCard } from "@/features/profile/components/RestaurantSettingsCard";

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

  it("renders settings with directly interactive switches and seating capacity", () => {
    render(<RestaurantSettingsCard settings={mockSettings} fullData={mockFullData} />);

    expect(screen.getByText("Restaurant Settings")).toBeInTheDocument();
    expect(screen.getByLabelText("Seating Capacity")).toHaveValue(50);

    const updateButton = screen.getByRole("button", { name: /update settings/i });
    expect(updateButton).toBeInTheDocument();
    expect(updateButton).toBeDisabled();
    expect(screen.queryByRole("button", { name: /cancel/i })).not.toBeInTheDocument();
  });

  it("enables update button and shows cancel button when seating capacity is changed", () => {
    render(<RestaurantSettingsCard settings={mockSettings} fullData={mockFullData} />);

    const updateButton = screen.getByRole("button", { name: /update settings/i });
    expect(updateButton).toBeDisabled();

    const capacityInput = screen.getByLabelText("Seating Capacity");
    fireEvent.change(capacityInput, { target: { value: "80" } });

    expect(updateButton).not.toBeDisabled();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();

    // Set valid seating capacity of 0
    fireEvent.change(capacityInput, { target: { value: "0" } });
    expect(updateButton).not.toBeDisabled();

    // Set invalid seating capacity (<0)
    fireEvent.change(capacityInput, { target: { value: "-5" } });
    expect(
      screen.getByText(PROFILE_MESSAGES.VALIDATION.SEATING_CAPACITY_NEGATIVE),
    ).toBeInTheDocument();
    expect(updateButton).toBeDisabled();
  });

  it("submits updated payload when dirty form is saved", () => {
    render(<RestaurantSettingsCard settings={mockSettings} fullData={mockFullData} />);

    // Toggle Loyalty Enabled from false to true
    const loyaltySwitch = screen.getByLabelText("Loyalty Enabled");
    fireEvent.click(loyaltySwitch);

    // Update seating capacity to 100
    const capacityInput = screen.getByLabelText("Seating Capacity");
    fireEvent.change(capacityInput, { target: { value: "100" } });

    const updateButton = screen.getByRole("button", { name: /update settings/i });
    expect(updateButton).not.toBeDisabled();

    fireEvent.click(updateButton);

    expect(mockMutate).toHaveBeenCalledTimes(1);
    expect(mockMutate).toHaveBeenCalledWith({
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
    });
  });

  it("reverts changes when cancel button is clicked", () => {
    render(<RestaurantSettingsCard settings={mockSettings} fullData={mockFullData} />);

    const capacityInput = screen.getByLabelText("Seating Capacity");
    fireEvent.change(capacityInput, { target: { value: "120" } });

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    expect(cancelButton).toBeInTheDocument();

    fireEvent.click(cancelButton);

    expect(capacityInput).toHaveValue(50);
    expect(screen.getByRole("button", { name: /update settings/i })).toBeDisabled();
    expect(screen.queryByRole("button", { name: /cancel/i })).not.toBeInTheDocument();
  });
});
