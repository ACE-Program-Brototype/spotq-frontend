import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { useOnboardStore } from "../store/onboard.store";
import BusinessInformationPage from "./BusinessInformationPage";

describe("BusinessInformationPage", () => {
  beforeEach(() => {
    useOnboardStore.getState().resetOnboardStore();
  });

  const renderComponent = (initialEntries = ["/restaurant/onboarding/business-information"]) => {
    return render(
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route
            path="/restaurant/onboarding/business-information"
            element={<BusinessInformationPage />}
          />
          <Route
            path="/restaurant/onboarding/documents"
            element={<div>Business Documents Page</div>}
          />
        </Routes>
      </MemoryRouter>,
    );
  };

  it("renders all form fields and the Continue button", () => {
    renderComponent();

    expect(screen.getByText("Basic Details")).toBeInTheDocument();
    expect(screen.getByLabelText(/owner's full name\*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/restaurant name\*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number\*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/seating capacity\*/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /continue/i })).toBeInTheDocument();
  });

  it("shows validation error messages when submitted with invalid inputs", async () => {
    const user = userEvent.setup();
    renderComponent();

    const submitButton = screen.getByRole("button", { name: /continue/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/owner name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/restaurant name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/phone number is required/i)).toBeInTheDocument();
    });
  });

  it("validates phone number and seating capacity restrictions", async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.type(screen.getByLabelText(/owner's full name\*/i), "John Doe");
    await user.type(screen.getByLabelText(/restaurant name\*/i), "Tasty Bites");
    await user.type(screen.getByLabelText(/phone number\*/i), "abc123");
    await user.type(screen.getByLabelText(/seating capacity\*/i), "-5");

    await user.click(screen.getByRole("button", { name: /continue/i }));

    await waitFor(() => {
      expect(screen.getByText(/phone number cannot contain letters/i)).toBeInTheDocument();
      expect(screen.getByText(/seating capacity must be at least 1/i)).toBeInTheDocument();
    });
  });

  it("saves valid form data to Zustand store and navigates to documents page", async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.type(screen.getByLabelText(/owner's full name\*/i), "Soorya");
    await user.type(screen.getByLabelText(/restaurant name\*/i), "abcRestaurant");
    await user.type(screen.getByLabelText(/phone number\*/i), "+19876543210");
    await user.type(screen.getByLabelText(/seating capacity\*/i), "50");

    await user.click(screen.getByRole("button", { name: /continue/i }));

    await waitFor(() => {
      expect(screen.getByText("Business Documents Page")).toBeInTheDocument();
    });

    const storeState = useOnboardStore.getState().businessInformation;
    expect(storeState).toEqual({
      owner_name: "Soorya",
      restaurant_name: "abcRestaurant",
      phone: "+19876543210",
      seating_capacity: 50,
    });
  });

  it("pre-populates form with saved values from Zustand store on mount", () => {
    useOnboardStore.getState().setBusinessInformation({
      owner_name: "Jane Smith",
      restaurant_name: "Spice Garden",
      phone: "+919876543210",
      seating_capacity: 120,
    });

    renderComponent();

    expect(screen.getByLabelText(/owner's full name\*/i)).toHaveValue("Jane Smith");
    expect(screen.getByLabelText(/restaurant name\*/i)).toHaveValue("Spice Garden");
    expect(screen.getByLabelText(/phone number\*/i)).toHaveValue("+919876543210");
    expect(screen.getByLabelText(/seating capacity\*/i)).toHaveValue(120);
  });
});
