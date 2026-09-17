import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { toast } from "sonner";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useUpdateRestaurantProfile } from "../hooks/use-update-restaurant-profile";
import type {
  RestaurantOverviewDetails,
  RestaurantProfileData,
  RestaurantProfileDetails,
} from "../types/restaurant-profile.types";
import { RestaurantOverviewCard } from "./RestaurantOverviewCard";

jest.mock("sonner", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

jest.mock("@/hooks/useFileUpload");
jest.mock("../hooks/use-update-restaurant-profile");

const mockUseFileUpload = useFileUpload as jest.MockedFunction<typeof useFileUpload>;
const mockUseUpdateRestaurantProfile = useUpdateRestaurantProfile as jest.MockedFunction<
  typeof useUpdateRestaurantProfile
>;

const mockRestaurant: RestaurantOverviewDetails = {
  id: "e4a77d13-6d0e-4a6a-8d19-58b1968817a0",
  name: "Mandi Central",
  phone: "+919876543210",
  ownerName: "Sarah Connor",
};

const mockProfile: RestaurantProfileDetails = {
  logo: "restaurants/e4a77d13-6d0e-4a6a-8d19-58b1968817a0/profile/logo.avif",
  coverImage: "restaurants/e4a77d13-6d0e-4a6a-8d19-58b1968817a0/profile/cover.png",
  description: "Traditional Arabian Mandi.",
  cuisineType: "Arabian",
  averageCost: 800,
};

const mockFullData: RestaurantProfileData = {
  restaurant: mockRestaurant,
  profile: mockProfile,
  settings: {
    acceptsQueue: true,
    acceptsQrOrders: true,
    loyaltyEnabled: false,
    autoAcceptQueue: false,
    seatingCapacity: 60,
  },
  businessHours: [
    {
      dayOfWeek: 1,
      openTime: "11:00",
      closeTime: "23:00",
      isClosed: false,
    },
  ],
};

describe("RestaurantOverviewCard Component", () => {
  const mockUpload = jest.fn();
  const mockMutate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    useAuthStore.setState({
      user: {
        email: "admin@mandicentral.com",
        restaurantId: "e4a77d13-6d0e-4a6a-8d19-58b1968817a0",
        role: "RESTAURANT_ADMIN",
      },
      accessToken: "mock-token",
      isAuthenticated: true,
    });

    mockUseFileUpload.mockReturnValue({
      upload: mockUpload,
      isUploading: false,
      progress: 0,
      error: null,
      reset: jest.fn(),
    });

    mockUseUpdateRestaurantProfile.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    } as unknown as ReturnType<typeof useUpdateRestaurantProfile>);

    global.URL.createObjectURL = jest.fn(() => "blob:http://localhost/fake-preview");
  });

  it("renders restaurant overview in view mode", () => {
    render(
      <RestaurantOverviewCard
        restaurant={mockRestaurant}
        profile={mockProfile}
        fullData={mockFullData}
      />,
    );

    expect(screen.getByText("Mandi Central")).toBeInTheDocument();
    expect(screen.getByText("+919876543210")).toBeInTheDocument();
    expect(screen.getByText("Sarah Connor")).toBeInTheDocument();
    expect(screen.getByText("Verified Restaurant")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /edit overview/i })).toBeInTheDocument();
  });

  it("enters edit mode and allows editing text inputs", () => {
    render(
      <RestaurantOverviewCard
        restaurant={mockRestaurant}
        profile={mockProfile}
        fullData={mockFullData}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /edit overview/i }));

    expect(screen.getByLabelText(/restaurant name/i)).toHaveValue("Mandi Central");
    expect(screen.getByLabelText(/contact phone/i)).toHaveValue("+919876543210");
    expect(screen.getByLabelText(/owner name/i)).toHaveValue("Sarah Connor");
    expect(screen.getByRole("button", { name: /save overview/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  it("validates required fields on save", () => {
    render(
      <RestaurantOverviewCard
        restaurant={mockRestaurant}
        profile={mockProfile}
        fullData={mockFullData}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /edit overview/i }));

    const nameInput = screen.getByLabelText(/restaurant name/i);
    fireEvent.change(nameInput, { target: { value: "   " } });

    fireEvent.click(screen.getByRole("button", { name: /save overview/i }));

    expect(screen.getByText(/restaurant name is required/i)).toBeInTheDocument();
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it("uploads AVIF logo file using PROFILE category and restaurants entity type", async () => {
    mockUpload.mockResolvedValue({
      s3ObjectKey: "restaurants/e4a77d13-6d0e-4a6a-8d19-58b1968817a0/profile/new_logo.avif",
      fileName: "new_logo.avif",
    });

    const { container } = render(
      <RestaurantOverviewCard
        restaurant={mockRestaurant}
        profile={mockProfile}
        fullData={mockFullData}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /edit overview/i }));

    const fileInputs = container.querySelectorAll('input[type="file"]');
    const logoInput = fileInputs[1] as HTMLInputElement;

    const avifFile = new File(["avif-binary"], "new_logo.avif", { type: "image/avif" });
    fireEvent.change(logoInput, { target: { files: [avifFile] } });

    await waitFor(() => {
      expect(mockUpload).toHaveBeenCalledWith(avifFile, {
        entityType: "restaurants",
        entityId: "e4a77d13-6d0e-4a6a-8d19-58b1968817a0",
        fileCategory: "PROFILE",
      });
    });

    // Wait for the upload promise in handleLogoChange to finish resolving
    await new Promise((resolve) => setTimeout(resolve, 50));

    fireEvent.click(screen.getByRole("button", { name: /save overview/i }));

    expect(mockMutate).toHaveBeenCalledWith(
      expect.objectContaining({
        profile: expect.objectContaining({
          logoKey: "restaurants/e4a77d13-6d0e-4a6a-8d19-58b1968817a0/profile/new_logo.avif",
        }),
        settings: expect.objectContaining({
          seatingCapacity: 60,
        }),
      }),
      expect.any(Object),
    );
  });

  it("handles upload failure and displays toast error message", async () => {
    mockUpload.mockRejectedValue(new Error("File type 'image/bmp' is not supported"));

    const { container } = render(
      <RestaurantOverviewCard
        restaurant={mockRestaurant}
        profile={mockProfile}
        fullData={mockFullData}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /edit overview/i }));

    const fileInputs = container.querySelectorAll('input[type="file"]');
    const coverInput = fileInputs[0] as HTMLInputElement;

    const testFile = new File(["test"], "cover.bmp", { type: "image/bmp" });
    fireEvent.change(coverInput, { target: { files: [testFile] } });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("File type 'image/bmp' is not supported");
    });
  });

  it("resets fields when cancel is clicked", () => {
    render(
      <RestaurantOverviewCard
        restaurant={mockRestaurant}
        profile={mockProfile}
        fullData={mockFullData}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /edit overview/i }));

    const nameInput = screen.getByLabelText(/restaurant name/i);
    fireEvent.change(nameInput, { target: { value: "Changed Name" } });

    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));

    expect(screen.queryByRole("button", { name: /save overview/i })).not.toBeInTheDocument();
    expect(screen.getByText("Mandi Central")).toBeInTheDocument();
  });
});
