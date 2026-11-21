import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/auth.store";
import LandingPage from "./LandingPage";

jest.mock("@/features/auth/hooks/use-logout", () => ({
  useLogout: () => ({
    handleLogout: jest.fn(),
    isLoading: false,
  }),
}));

describe("LandingPage", () => {
  beforeEach(() => {
    useAuthStore.getState().clearAuth();
  });

  it("renders landing page elements for unauthenticated visitors", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <LandingPage />
      </MemoryRouter>,
    );
    expect(screen.getAllByText(/spotQ/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Skip the Wait/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Partner with us/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Staff Login/i).length).toBeGreaterThan(0);
  });

  it("redirects authenticated customer to /home", () => {
    useAuthStore.getState().setUser({
      _id: "customer-1",
      name: "Test Customer",
      email: "customer@test.com",
      role: "CUSTOMER",
    });

    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<div>Customer Catalog Home</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Customer Catalog Home")).toBeInTheDocument();
    expect(screen.queryByText(/Skip the Wait/i)).not.toBeInTheDocument();
  });
});
