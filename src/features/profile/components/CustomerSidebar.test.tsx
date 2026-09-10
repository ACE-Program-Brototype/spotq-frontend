import { render, screen } from "@testing-library/react";
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
  it("renders all navigation items", () => {
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

    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Orders")).toBeInTheDocument();
    expect(screen.getByText("Queues")).toBeInTheDocument();
    expect(screen.getByText("Loyalties")).toBeInTheDocument();
    expect(screen.getByText("Payments")).toBeInTheDocument();
  });

  it("marks /profile as active when on /profile or /profile/edit, but not on /profile-other", () => {
    const { rerender } = render(
      <MemoryRouter initialEntries={["/profile"]}>
        <CustomerSidebar />
      </MemoryRouter>,
    );

    const profileLink = screen.getByRole("link", { name: /profile/i });
    expect(profileLink.className).toContain("bg-[#ff6b00]");

    rerender(
      <MemoryRouter initialEntries={["/orders-archive"]}>
        <CustomerSidebar />
      </MemoryRouter>,
    );

    const ordersLink = screen.getByRole("link", { name: /orders/i });
    expect(ordersLink.className).not.toContain("bg-[#ff6b00]");
  });
});
