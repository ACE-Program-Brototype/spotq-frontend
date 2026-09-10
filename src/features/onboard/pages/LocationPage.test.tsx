import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import * as locationIqService from "@/services/locationiq/locationiq.service";
import { useOnboardStore } from "../store/onboard.store";
import LocationPage from "./LocationPage";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("@/services/locationiq/locationiq.service", () => ({
  ...jest.requireActual("@/services/locationiq/locationiq.service"),
  searchLocationIQ: jest.fn(),
}));

describe("LocationPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useOnboardStore.getState().resetOnboardStore();
  });

  const renderComponent = () =>
    render(
      <BrowserRouter>
        <LocationPage />
      </BrowserRouter>,
    );

  it("renders all address form fields, search input, and buttons", () => {
    renderComponent();

    expect(screen.getByText("Location Details")).toBeInTheDocument();
    expect(screen.getByLabelText(/search location/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/address line 1/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/city/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/state/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/country/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/pincode/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/latitude/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/longitude/i)).toBeInTheDocument();
  });

  it("shows validation errors when submitting empty form", async () => {
    renderComponent();

    const continueButton = screen.getByRole("button", { name: /continue/i });
    fireEvent.click(continueButton);

    expect(
      await screen.findByText(/address line 1 must be at least 2 characters/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/city name must be at least 2 characters/i)).toBeInTheDocument();
    expect(screen.getByText(/state name must be at least 2 characters/i)).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalledWith("/restaurant/onboarding/review");
  });

  it("navigates back to documents page when Back is clicked", async () => {
    renderComponent();

    const backButton = screen.getByRole("button", { name: /back/i });
    await userEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith("/restaurant/onboarding/documents");
  });

  it("populates address form when a LocationIQ suggestion is selected", async () => {
    const mockSuggestions = [
      {
        place_id: "101",
        lat: "12.9715987",
        lon: "77.5945627",
        display_name: "12, MG Road, Indiranagar, Bengaluru, Karnataka, 560001, India",
        address: {
          house_number: "12",
          road: "MG Road",
          suburb: "Indiranagar",
          city: "Bengaluru",
          state: "Karnataka",
          postcode: "560001",
          country: "India",
        },
      },
    ];

    (locationIqService.searchLocationIQ as jest.Mock).mockResolvedValue(mockSuggestions);

    renderComponent();

    const searchInput = screen.getByLabelText(/search location/i);
    await userEvent.type(searchInput, "MG Road");

    await waitFor(() => {
      expect(locationIqService.searchLocationIQ).toHaveBeenCalledWith(
        "MG Road",
        expect.any(Object),
      );
    });

    const suggestionItem = await screen.findByText("12");
    fireEvent.click(suggestionItem);

    expect((screen.getByLabelText(/address line 1/i) as HTMLInputElement).value).toBe("12 MG Road");
    expect((screen.getByLabelText(/city/i) as HTMLInputElement).value).toBe("Bengaluru");
    expect((screen.getByLabelText(/state/i) as HTMLInputElement).value).toBe("Karnataka");
    expect((screen.getByLabelText(/pincode/i) as HTMLInputElement).value).toBe("560001");
  });

  it("saves location data to store and navigates to review on valid submit", async () => {
    renderComponent();

    fireEvent.change(screen.getByLabelText(/address line 1/i), {
      target: { value: "100 Indiranagar 10th Main" },
    });
    fireEvent.change(screen.getByLabelText(/city/i), { target: { value: "Bengaluru" } });
    fireEvent.change(screen.getByLabelText(/state/i), { target: { value: "Karnataka" } });
    fireEvent.change(screen.getByLabelText(/country/i), { target: { value: "India" } });
    fireEvent.change(screen.getByLabelText(/pincode/i), { target: { value: "560038" } });
    fireEvent.change(screen.getByLabelText(/latitude/i), { target: { value: "12.9716" } });
    fireEvent.change(screen.getByLabelText(/longitude/i), { target: { value: "77.5946" } });

    const continueButton = screen.getByRole("button", { name: /continue/i });
    fireEvent.click(continueButton);

    await waitFor(() => {
      expect(useOnboardStore.getState().location).toEqual({
        address_line1: "100 Indiranagar 10th Main",
        address_line2: "",
        city: "Bengaluru",
        state: "Karnataka",
        country: "India",
        pincode: "560038",
        latitude: 12.9716,
        longitude: 77.5946,
      });
      expect(mockNavigate).toHaveBeenCalledWith("/restaurant/onboarding/review");
    });
  });
});
