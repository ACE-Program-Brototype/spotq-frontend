import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { useAuthStore } from "@/features/auth/store/auth.store";
import ProtectedLayout from "./ProtectedLayout";

describe("ProtectedLayout", () => {
  beforeEach(() => {
    useAuthStore.getState().clearAuth();
  });

  it("redirects to '/login' by default when user is not authenticated", () => {
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route element={<ProtectedLayout />}>
            <Route path="/dashboard" element={<div>Dashboard Content</div>} />
          </Route>
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Login Page")).toBeInTheDocument();
    expect(screen.queryByText("Dashboard Content")).not.toBeInTheDocument();
  });

  it("redirects logged-in ADMIN to '/admin/dashboard' when accessing customer routes like '/'", () => {
    useAuthStore.getState().setUser({
      _id: "1",
      name: "Admin User",
      email: "admin@spotq.com",
      role: "ADMIN",
      created_at: "2026-08-18T21:59:52.665Z",
    });

    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route element={<ProtectedLayout />}>
            <Route path="/" element={<div>Customer Home Page</div>} />
          </Route>
          <Route path="/admin/dashboard" element={<div>Admin Dashboard Page</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Admin Dashboard Page")).toBeInTheDocument();
    expect(screen.queryByText("Customer Home Page")).not.toBeInTheDocument();
  });

  it("redirects logged-in CUSTOMER to '/' when accessing admin protected routes like '/admin/dashboard'", () => {
    useAuthStore.getState().setUser({
      _id: "2",
      name: "Customer User",
      email: "customer@spotq.com",
      role: "CUSTOMER",
      created_at: "2026-08-18T21:59:52.665Z",
    });

    render(
      <MemoryRouter initialEntries={["/admin/dashboard"]}>
        <Routes>
          <Route element={<ProtectedLayout allowedRoles={["ADMIN"]} redirectTo="/admin/login" />}>
            <Route path="/admin/dashboard" element={<div>Admin Dashboard Content</div>} />
          </Route>
          <Route path="/" element={<div>Customer Home Page</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Customer Home Page")).toBeInTheDocument();
    expect(screen.queryByText("Admin Dashboard Content")).not.toBeInTheDocument();
  });

  it("redirects unauthenticated user to custom redirectTo destination when specified (e.g. /admin/login)", () => {
    render(
      <MemoryRouter initialEntries={["/admin/dashboard"]}>
        <Routes>
          <Route element={<ProtectedLayout redirectTo="/admin/login" />}>
            <Route path="/admin/dashboard" element={<div>Dashboard Content</div>} />
          </Route>
          <Route path="/admin/login" element={<div>Admin Login Page</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Admin Login Page")).toBeInTheDocument();
    expect(screen.queryByText("Dashboard Content")).not.toBeInTheDocument();
  });

  it("renders protected child route outlet when customer is authenticated", () => {
    useAuthStore.getState().setUser({
      _id: "1",
      name: "Customer",
      email: "customer@spotq.com",
      role: "CUSTOMER",
      created_at: "2026-08-18T21:59:52.665Z",
    });

    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route element={<ProtectedLayout />}>
            <Route path="/" element={<div>Customer Home Content</div>} />
          </Route>
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Customer Home Content")).toBeInTheDocument();
    expect(screen.queryByText("Login Page")).not.toBeInTheDocument();
  });

  it("allows access when user has an allowed role", () => {
    useAuthStore.getState().setUser({
      _id: "1",
      name: "Admin User",
      email: "admin@spotq.com",
      role: "ADMIN",
      created_at: "2026-08-18T21:59:52.665Z",
    });

    render(
      <MemoryRouter initialEntries={["/admin/dashboard"]}>
        <Routes>
          <Route element={<ProtectedLayout allowedRoles={["ADMIN"]} redirectTo="/admin/login" />}>
            <Route path="/admin/dashboard" element={<div>Admin Allowed</div>} />
          </Route>
          <Route path="/admin/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Admin Allowed")).toBeInTheDocument();
  });
});
