import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";
import {
  RESTAURANT_SETTINGS_FIELDS,
  RESTAURANT_SETTINGS_MESSAGES,
} from "@/features/profile/constants/profile.constants";
import { useUpdateRestaurantProfile } from "@/features/profile/hooks/use-update-restaurant-profile";
import type {
  RestaurantProfileData,
  RestaurantSettingsDetails,
} from "@/features/profile/types/restaurant-profile.types";
import { SUBSCRIPTION_QUERY_KEYS } from "@/features/subscription/constants/subscription.constants";
import { RestaurantSettingsCard } from "./RestaurantSettingsCard";

jest.mock("../hooks/use-update-restaurant-profile");

const mockUseUpdateRestaurantProfile = useUpdateRestaurantProfile as jest.MockedFunction<
  typeof useUpdateRestaurantProfile
>;

const mockSettings: RestaurantSettingsDetails = {
  isOpened: true,
  acceptsQueue: true,
  acceptsQrOrders: true,
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

const createTestWrapper = (hasQueuePro = true) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  queryClient.setQueryData(SUBSCRIPTION_QUERY_KEYS.RESTAURANT_STATUS, {
    subscriptionPlanCode: hasQueuePro ? "QUEUE_PRO" : "STARTER",
    subscription: {
      planCode: hasQueuePro ? "QUEUE_PRO" : "STARTER",
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{children}</MemoryRouter>
    </QueryClientProvider>
  );
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

  it("renders store open status and virtual queue cards with initial values and hides action buttons", () => {
    const wrapper = createTestWrapper(true);
    render(<RestaurantSettingsCard settings={mockSettings} fullData={mockFullData} />, {
      wrapper,
    });

    expect(screen.getByText(RESTAURANT_SETTINGS_MESSAGES.TITLE)).toBeInTheDocument();
    expect(screen.getByLabelText(RESTAURANT_SETTINGS_FIELDS.STORE_OPEN.title)).toBeChecked();
    expect(screen.getByLabelText(RESTAURANT_SETTINGS_FIELDS.VIRTUAL_QUEUE.title)).toBeChecked();

    expect(screen.queryByTestId("save-settings-button")).not.toBeInTheDocument();
    expect(screen.queryByTestId("cancel-settings-button")).not.toBeInTheDocument();
  });

  it("enables save button and displays cancel button when store open toggle changes", () => {
    const wrapper = createTestWrapper(true);
    render(<RestaurantSettingsCard settings={mockSettings} fullData={mockFullData} />, {
      wrapper,
    });

    const storeOpenSwitch = screen.getByLabelText(RESTAURANT_SETTINGS_FIELDS.STORE_OPEN.title);
    fireEvent.click(storeOpenSwitch);

    const saveButton = screen.getByTestId("save-settings-button");
    expect(saveButton).not.toBeDisabled();
    expect(screen.getByTestId("cancel-settings-button")).toBeInTheDocument();
  });

  it("submits updated payload when changes are saved", () => {
    const wrapper = createTestWrapper(true);
    render(<RestaurantSettingsCard settings={mockSettings} fullData={mockFullData} />, {
      wrapper,
    });

    const queueSwitch = screen.getByLabelText(RESTAURANT_SETTINGS_FIELDS.VIRTUAL_QUEUE.title);
    fireEvent.click(queueSwitch);

    const saveButton = screen.getByTestId("save-settings-button");
    expect(saveButton).not.toBeDisabled();
    fireEvent.click(saveButton);

    expect(mockMutate).toHaveBeenCalledTimes(1);
    expect(mockMutate).toHaveBeenCalledWith(
      expect.objectContaining({
        settings: expect.objectContaining({
          isOpened: true,
          acceptsQueue: false,
        }),
      }),
    );
  });

  it("reverts changes and hides action buttons when cancel button is clicked", () => {
    const wrapper = createTestWrapper(true);
    render(<RestaurantSettingsCard settings={mockSettings} fullData={mockFullData} />, {
      wrapper,
    });

    const storeOpenSwitch = screen.getByLabelText(RESTAURANT_SETTINGS_FIELDS.STORE_OPEN.title);
    fireEvent.click(storeOpenSwitch);

    const cancelButton = screen.getByTestId("cancel-settings-button");
    expect(cancelButton).toBeInTheDocument();
    fireEvent.click(cancelButton);

    expect(screen.queryByTestId("save-settings-button")).not.toBeInTheDocument();
    expect(screen.queryByTestId("cancel-settings-button")).not.toBeInTheDocument();
  });

  it("locks queue toggle and displays upgrade badge when restaurant lacks QueuePro", () => {
    const wrapper = createTestWrapper(false);
    render(<RestaurantSettingsCard settings={mockSettings} fullData={mockFullData} />, {
      wrapper,
    });

    expect(
      screen.getByText(RESTAURANT_SETTINGS_MESSAGES.QUEUE_PRO_REQUIRED_BADGE),
    ).toBeInTheDocument();
    const queueSwitch = screen.getByLabelText(RESTAURANT_SETTINGS_FIELDS.VIRTUAL_QUEUE.title);
    expect(queueSwitch).toBeDisabled();
  });
});
