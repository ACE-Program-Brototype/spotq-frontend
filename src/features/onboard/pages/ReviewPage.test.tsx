import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { useOnboardStore } from "../store/onboard.store";
import ReviewPage from "./ReviewPage";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("@/features/auth/services/auth.service", () => ({
  completeRestaurantOnboarding: jest.fn().mockResolvedValue({ success: true, message: "Success" }),
}));

describe("ReviewPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useOnboardStore.getState().resetOnboardStore();
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <ReviewPage />
      </BrowserRouter>,
    );
  };

  it("renders incomplete warning alert when store data is empty", () => {
    renderComponent();

    expect(screen.getByText("Review & Submit")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Some onboarding steps are incomplete")).toBeInTheDocument();
    expect(screen.getByText("Business information not provided yet.")).toBeInTheDocument();
    expect(screen.getByText("Location details not provided yet.")).toBeInTheDocument();
  });

  it("renders all onboarding sections when store data is complete", () => {
    useOnboardStore.setState({
      businessInformation: {
        restaurant_name: "Spice Garden",
        phone: "9876543210",
        owner_name: "Rahul Sharma",
        seating_capacity: 45,
      },
      documents: {
        fssai: { documentName: "fssai_cert.pdf", documentKey: "key/fssai.pdf" },
        businessRegistration: { documentName: "business_reg.pdf", documentKey: "key/reg.pdf" },
        ownerIdentity: { documentName: "owner_id.pdf", documentKey: "key/id.pdf" },
        gst: { documentName: "gst_cert.pdf", documentKey: "key/gst.pdf" },
        businessPan: { documentName: "pan_card.pdf", documentKey: "key/pan.pdf" },
      },
      restaurantImages: [{ fileName: "photo1.jpg", objectKey: "key/photo1.jpg", displayOrder: 1 }],
      location: {
        address_line1: "100 Indiranagar 10th Main",
        address_line2: "Near Metro",
        city: "Bengaluru",
        state: "Karnataka",
        country: "India",
        pincode: "560038",
        latitude: 12.9716,
        longitude: 77.5946,
      },
    });

    renderComponent();

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.getByText("Spice Garden")).toBeInTheDocument();
    expect(screen.getByText("9876543210")).toBeInTheDocument();
    expect(screen.getByText("Rahul Sharma")).toBeInTheDocument();
    expect(screen.getByText("45 seats")).toBeInTheDocument();

    expect(screen.getByText("fssai_cert.pdf")).toBeInTheDocument();
    expect(screen.getByText("1 photo uploaded")).toBeInTheDocument();

    expect(screen.getByText("100 Indiranagar 10th Main, Near Metro")).toBeInTheDocument();
    expect(screen.getByText("Bengaluru, Karnataka")).toBeInTheDocument();
    expect(screen.getByText("India - 560038")).toBeInTheDocument();
  });

  it("navigates to respective steps when Edit buttons are clicked", () => {
    renderComponent();

    const editButtons = screen.getAllByRole("button", { name: /edit/i });
    expect(editButtons).toHaveLength(3);

    fireEvent.click(editButtons[0]);
    expect(mockNavigate).toHaveBeenCalledWith("/restaurant/onboarding/business-information");

    fireEvent.click(editButtons[1]);
    expect(mockNavigate).toHaveBeenCalledWith("/restaurant/onboarding/documents");

    fireEvent.click(editButtons[2]);
    expect(mockNavigate).toHaveBeenCalledWith("/restaurant/onboarding/location");
  });

  it("navigates back to location page when Back button is clicked", () => {
    renderComponent();

    const backButton = screen.getByRole("button", { name: /back/i });
    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith("/restaurant/onboarding/location");
  });

  it("handles submit button click successfully", async () => {
    const { completeRestaurantOnboarding } = require("@/features/auth/services/auth.service");

    useOnboardStore.setState({
      businessInformation: {
        restaurant_name: "Spice Garden",
        phone: "9876543210",
        owner_name: "Rahul Sharma",
        seating_capacity: 45,
      },
      documents: {
        fssai: { documentName: "fssai_cert.pdf", documentKey: "key/fssai.pdf" },
        businessRegistration: { documentName: "business_reg.pdf", documentKey: "key/reg.pdf" },
        ownerIdentity: { documentName: "owner_id.pdf", documentKey: "key/id.pdf" },
        gst: { documentName: "gst_cert.pdf", documentKey: "key/gst.pdf" },
        businessPan: { documentName: "pan_card.pdf", documentKey: "key/pan.pdf" },
      },
      restaurantImages: [{ fileName: "photo1.jpg", objectKey: "key/photo1.jpg", displayOrder: 1 }],
      location: {
        address_line1: "100 Indiranagar 10th Main",
        address_line2: "Near Metro",
        city: "Bengaluru",
        state: "Karnataka",
        country: "India",
        pincode: "560038",
        latitude: 12.9716,
        longitude: 77.5946,
      },
    });

    renderComponent();

    const submitButton = screen.getByRole("button", { name: /submit application/i });
    fireEvent.click(submitButton);

    expect(completeRestaurantOnboarding).toHaveBeenCalled();
    await waitFor(() => {
      expect(useOnboardStore.getState().businessInformation).toBeNull();
    });
  });
});
