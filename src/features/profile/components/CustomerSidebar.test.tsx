import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { CustomerSidebar } from "./CustomerSidebar";

jest.mock("@/features/auth/hooks/use-logout", () => ({
  useLogout: () => ({
    handleLogout: jest.fn(),
    isLoading: false,
  }),
}));

jest.mock("@/features/auth/store/auth.store", () => ({
  useAuthStore: jest.fn((selector) =>
    selector({
      user: { id: "1", name: "John Doe", email: "john@example.com" },
    }),
  ),
}));

describe("CustomerSidebar Component", () => {
  const getDesktopNav = () =>
    within(screen.getByRole("navigation", { name: "Customer Account Navigation Desktop" }));

  it("renders the customer account navigation items", () => {
    render(
      <MemoryRouter initialEntries={["/profile"]}>
        <CustomerSidebar
          profile={{
            id: "1",
            full_name: "John Doe",
            email: "john@example.com",
            phone: null,
            status: "ACTIVE",
            gender: null,
            dob: null,
            created_at: "",
            updated_at: "",
          }}
        />
      </MemoryRouter>,
    );

    const desktopNav = getDesktopNav();
    expect(desktopNav.getByText("Profile")).toBeInTheDocument();
    expect(desktopNav.getByText("Orders")).toBeInTheDocument();
    expect(desktopNav.getByText("Payments")).toBeInTheDocument();
  });

  it("marks /profile as active when on /profile or /profile/edit, but not on /profile-other", () => {
    const { rerender } = render(
      <MemoryRouter initialEntries={["/profile"]}>
        <CustomerSidebar />
      </MemoryRouter>,
    );

    const profileLink = getDesktopNav().getByRole("link", { name: /profile/i });
    expect(profileLink.className).toContain("bg-[#ff6b00]");

    rerender(
      <MemoryRouter initialEntries={["/orders-archive"]}>
        <CustomerSidebar />
      </MemoryRouter>,
    );

    const ordersLink = getDesktopNav().getByRole("link", { name: /orders/i });
    expect(ordersLink.className).not.toContain("bg-[#ff6b00]");
  });

  it("marks payments as active when on /profile/payments", () => {
    render(
      <MemoryRouter initialEntries={["/profile/payments"]}>
        <CustomerSidebar />
      </MemoryRouter>,
    );

    const desktopNav = getDesktopNav();
    const paymentsLink = desktopNav.getByRole("link", { name: /payments/i });
    expect(paymentsLink.className).toContain("bg-[#ff6b00]");
    const profileLink = desktopNav.getByRole("link", { name: /profile/i });
    expect(profileLink.className).not.toContain("bg-[#ff6b00]");
  });
});
