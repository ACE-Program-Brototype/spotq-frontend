import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { useAuthStore } from "@/features/auth/store/auth.store";
import AuthLayout from "./AuthLayout";

describe("AuthLayout", () => {
  beforeEach(() => {
    useAuthStore.getState().clearAuth();
  });

  it("renders auth child route outlet when user is not authenticated", () => {
    render(
      <MemoryRouter initialEntries={["/admin/login"]}>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/admin/login" element={<div>Login Page Form</div>} />
          </Route>
          <Route path="/" element={<div>Home Landing Page</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Login Page Form")).toBeInTheDocument();
    expect(screen.queryByText("Home Landing Page")).not.toBeInTheDocument();
  });

  it("redirects customer to '/' by default when user is already authenticated", () => {
    useAuthStore.getState().setUser({
      _id: "1",
      name: "Customer",
      email: "customer@spotq.com",
      role: "CUSTOMER",
      created_at: "2026-08-18T21:59:52.665Z",
    });

    render(
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<div>Login Page Form</div>} />
          </Route>
          <Route path="/" element={<div>Home Landing Page</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Home Landing Page")).toBeInTheDocument();
    expect(screen.queryByText("Login Page Form")).not.toBeInTheDocument();
  });

  it("redirects admin to '/admin/dashboard' when already authenticated", () => {
    useAuthStore.getState().setUser({
      _id: "1",
      name: "Admin",
      email: "admin@spotq.com",
      role: "ADMIN",
      created_at: "2026-08-18T21:59:52.665Z",
    });

    render(
      <MemoryRouter initialEntries={["/admin/login"]}>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/admin/login" element={<div>Login Page Form</div>} />
          </Route>
          <Route path="/admin/dashboard" element={<div>Admin Dashboard Page</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Admin Dashboard Page")).toBeInTheDocument();
    expect(screen.queryByText("Login Page Form")).not.toBeInTheDocument();
  });

  it("redirects to custom redirectTo destination when specified (e.g. /admin/dashboard)", () => {
    useAuthStore.getState().setUser({
      _id: "1",
      name: "Admin",
      email: "admin@spotq.com",
      role: "ADMIN",
      created_at: "2026-08-18T21:59:52.665Z",
    });

    render(
      <MemoryRouter initialEntries={["/admin/login"]}>
        <Routes>
          <Route element={<AuthLayout redirectTo="/admin/dashboard" />}>
            <Route path="/admin/login" element={<div>Login Page Form</div>} />
          </Route>
          <Route path="/admin/dashboard" element={<div>Admin Dashboard Page</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Admin Dashboard Page")).toBeInTheDocument();
  });
});
