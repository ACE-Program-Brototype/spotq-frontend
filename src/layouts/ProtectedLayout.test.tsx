import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { useAuthStore } from "@/features/auth/store/auth.store";
import ProtectedLayout from "./ProtectedLayout";

describe("ProtectedLayout", () => {
  beforeEach(() => {
    useAuthStore.getState().clearAuth();
  });

  it("redirects to '/' by default when user is not authenticated", () => {
    render(
      <MemoryRouter initialEntries={["/admin/dashboard"]}>
        <Routes>
          <Route element={<ProtectedLayout />}>
            <Route path="/admin/dashboard" element={<div>Dashboard Content</div>} />
          </Route>
          <Route path="/" element={<div>Home Landing Page</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Home Landing Page")).toBeInTheDocument();
    expect(screen.queryByText("Dashboard Content")).not.toBeInTheDocument();
  });

  it("redirects to custom redirectTo destination when specified (e.g. /admin/login)", () => {
    render(
      <MemoryRouter initialEntries={["/admin/dashboard"]}>
        <Routes>
          <Route element={<ProtectedLayout redirectTo="/admin/login" />}>
            <Route path="/admin/dashboard" element={<div>Dashboard Content</div>} />
          </Route>
          <Route path="/admin/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Login Page")).toBeInTheDocument();
    expect(screen.queryByText("Dashboard Content")).not.toBeInTheDocument();
  });

  it("renders protected child route outlet when user is authenticated", () => {
    useAuthStore.getState().setUser({
      _id: "1",
      name: "Admin",
      email: "admin@spotq.com",
      created_at: "2026-08-18T21:59:52.665Z",
    });

    render(
      <MemoryRouter initialEntries={["/admin/dashboard"]}>
        <Routes>
          <Route element={<ProtectedLayout />}>
            <Route path="/admin/dashboard" element={<div>Dashboard Content</div>} />
          </Route>
          <Route path="/" element={<div>Home Landing Page</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Dashboard Content")).toBeInTheDocument();
    expect(screen.queryByText("Home Landing Page")).not.toBeInTheDocument();
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

  it("redirects when user lacks the required allowed role", () => {
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
            <Route path="/admin/dashboard" element={<div>Admin Only</div>} />
          </Route>
          <Route path="/admin/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Login Page")).toBeInTheDocument();
    expect(screen.queryByText("Admin Only")).not.toBeInTheDocument();
  });
});
