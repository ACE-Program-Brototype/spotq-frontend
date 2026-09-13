import { render, screen } from "@testing-library/react";

import { useAuthStore } from "@/features/auth/store/auth.store";
import AdminDashboardPage from "./AdminDashboardPage";

describe("AdminDashboardPage", () => {
  beforeEach(() => {
    useAuthStore.getState().setUser({
      _id: "admin-1",
      name: "Admin User",
      email: "admin@spotq.com",
      created_at: "2026-08-18T21:59:52.665Z",
    });
  });

  it("renders page title, welcome text with admin name, and stat cards", () => {
    render(<AdminDashboardPage />);

    expect(screen.getByRole("heading", { name: /^dashboard$/i })).toBeInTheDocument();
    expect(screen.getByText(/welcome back, admin user/i)).toBeInTheDocument();
    expect(screen.getByText("Total Users")).toBeInTheDocument();
    expect(screen.getByText("Active Orders")).toBeInTheDocument();
    expect(screen.getByText("Revenue")).toBeInTheDocument();
    expect(screen.getByText("System Health")).toBeInTheDocument();
  });

  it("renders analytics overview and quick actions placeholders", () => {
    render(<AdminDashboardPage />);

    expect(screen.getByText("Analytics Overview")).toBeInTheDocument();
    expect(screen.getByText("Recent Users")).toBeInTheDocument();
    expect(screen.getByText("Quick Actions")).toBeInTheDocument();
    expect(screen.getByText("Manage Users")).toBeInTheDocument();
  });
});
