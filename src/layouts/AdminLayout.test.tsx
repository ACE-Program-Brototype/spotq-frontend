import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { useAdminLogout } from "@/features/auth/hooks/useAdminLogout";
import { useAuthStore } from "@/features/auth/store/auth.store";
import AdminLayout from "./AdminLayout";

jest.mock("@/features/auth/hooks/useAdminLogout");

const mockUseAdminLogout = useAdminLogout as jest.MockedFunction<typeof useAdminLogout>;

describe("AdminLayout Shell", () => {
  const mockLogout = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAdminLogout.mockReturnValue({
      mutate: mockLogout,
      isPending: false,
    } as unknown as ReturnType<typeof useAdminLogout>);

    useAuthStore.getState().setUser({
      _id: "admin-1",
      name: "Admin User",
      email: "admin@spotq.com",
      created_at: "2026-08-18T21:59:52.665Z",
    });
  });

  const renderWithRouter = (initialRoute = "/admin") =>
    render(
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<div>Admin Child Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

  it("renders header with branding, user info, and child outlet content", () => {
    renderWithRouter();

    expect(screen.getByText("Admin Console")).toBeInTheDocument();
    expect(screen.getByText("spotQ Platform")).toBeInTheDocument();
    expect(screen.getByText("Admin User")).toBeInTheDocument();
    expect(screen.getByText("admin@spotq.com")).toBeInTheDocument();
    expect(screen.getByText("AU")).toBeInTheDocument();
    expect(screen.getByText("Admin Child Content")).toBeInTheDocument();
  });

  it("opens logout confirmation modal when logout button is clicked", () => {
    renderWithRouter();

    const logoutTrigger = screen.getByRole("button", { name: /log out/i });
    fireEvent.click(logoutTrigger);

    expect(screen.getByRole("heading", { name: /sign out/i })).toBeInTheDocument();
    expect(
      screen.getByText(/are you sure you want to end your current session/i),
    ).toBeInTheDocument();

    const confirmBtn = screen.getByRole("button", { name: /^sign out$/i });
    fireEvent.click(confirmBtn);

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});
