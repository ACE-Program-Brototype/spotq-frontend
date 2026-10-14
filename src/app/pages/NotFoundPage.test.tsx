import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import {
  ADMIN_ROUTES,
  CUSTOMER_ROUTES,
  RESTAURANT_ROUTES,
  STAFF_ROUTES,
} from "@/app/router/routes.constants";
import { useAuthStore } from "@/features/auth/store/auth.store";
import NotFoundPage from "./NotFoundPage";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("NotFoundPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.getState().clearAuth();
  });

  it("renders 404 error page with default home redirection for guest", () => {
    render(
      <MemoryRouter initialEntries={["/some-random-route"]}>
        <NotFoundPage />
      </MemoryRouter>,
    );

    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByText(/We couldn't find this page/i)).toBeInTheDocument();
    expect(screen.getByText("/some-random-route")).toBeInTheDocument();

    const homeLink = screen.getByRole("link", { name: /Return to Home/i });
    expect(homeLink).toHaveAttribute("href", CUSTOMER_ROUTES.HOME);
  });

  it("redirects ADMIN user to admin dashboard", () => {
    useAuthStore.getState().setUser({
      _id: "admin-1",
      email: "admin@spotq.com",
      role: "ADMIN",
    });

    render(
      <MemoryRouter initialEntries={["/admin/missing-page"]}>
        <NotFoundPage />
      </MemoryRouter>,
    );

    const adminLink = screen.getByRole("link", { name: /Go to Admin Dashboard/i });
    expect(adminLink).toHaveAttribute("href", ADMIN_ROUTES.DASHBOARD);
    expect(screen.getByText("ADMIN")).toBeInTheDocument();
  });

  it("redirects RESTAURANT_ADMIN user to restaurant dashboard", () => {
    useAuthStore.getState().setUser({
      _id: "res-1",
      email: "owner@spotq.com",
      role: "RESTAURANT_ADMIN",
    });

    render(
      <MemoryRouter initialEntries={["/restaurant/invalid-setting"]}>
        <NotFoundPage />
      </MemoryRouter>,
    );

    const restaurantLink = screen.getByRole("link", { name: /Go to Partner Dashboard/i });
    expect(restaurantLink).toHaveAttribute("href", RESTAURANT_ROUTES.DASHBOARD);
  });

  it("redirects STAFF user to staff dashboard", () => {
    useAuthStore.getState().setUser({
      _id: "staff-1",
      email: "staff@spotq.com",
      role: "STAFF",
    });

    render(
      <MemoryRouter initialEntries={["/staff/invalid"]}>
        <NotFoundPage />
      </MemoryRouter>,
    );

    const staffLink = screen.getByRole("link", { name: /Go to Staff Dashboard/i });
    expect(staffLink).toHaveAttribute("href", STAFF_ROUTES.DASHBOARD);
  });

  it("redirects unauthenticated user on /restaurant/* to restaurant portal login", () => {
    render(
      <MemoryRouter initialEntries={["/restaurant/some-unknown-path"]}>
        <NotFoundPage />
      </MemoryRouter>,
    );

    const portalLink = screen.getByRole("link", { name: /Go to Partner Portal/i });
    expect(portalLink).toHaveAttribute("href", RESTAURANT_ROUTES.LOGIN);
  });

  it("redirects unauthenticated user on /admin/* to admin sign in", () => {
    render(
      <MemoryRouter initialEntries={["/admin/unknown-page"]}>
        <NotFoundPage />
      </MemoryRouter>,
    );

    const adminLoginLink = screen.getByRole("link", { name: /Go to Admin Sign In/i });
    expect(adminLoginLink).toHaveAttribute("href", ADMIN_ROUTES.LOGIN);
  });

  it("redirects unauthenticated user on /staff/* to staff sign in", () => {
    render(
      <MemoryRouter initialEntries={["/staff/unknown-page"]}>
        <NotFoundPage />
      </MemoryRouter>,
    );

    const staffLoginLink = screen.getByRole("link", { name: /Go to Staff Sign In/i });
    expect(staffLoginLink).toHaveAttribute("href", STAFF_ROUTES.LOGIN);
  });

  it("navigates back (-1) when in-app history state idx > 0", () => {
    const originalState = window.history.state;
    Object.defineProperty(window.history, "state", {
      value: { idx: 1 },
      configurable: true,
      writable: true,
    });

    render(
      <MemoryRouter initialEntries={["/unknown"]}>
        <NotFoundPage />
      </MemoryRouter>,
    );

    const goBackButton = screen.getByRole("button", { name: /Go Back/i });
    fireEvent.click(goBackButton);

    expect(mockedNavigate).toHaveBeenCalledWith(-1);

    Object.defineProperty(window.history, "state", {
      value: originalState,
      configurable: true,
      writable: true,
    });
  });

  it("navigates to fallback path when history state idx is 0 or missing", () => {
    const originalState = window.history.state;
    Object.defineProperty(window.history, "state", {
      value: { idx: 0 },
      configurable: true,
      writable: true,
    });

    render(
      <MemoryRouter initialEntries={["/unknown"]}>
        <NotFoundPage />
      </MemoryRouter>,
    );

    const goBackButton = screen.getByRole("button", { name: /Go Back/i });
    fireEvent.click(goBackButton);

    expect(mockedNavigate).toHaveBeenCalledWith(CUSTOMER_ROUTES.HOME);

    Object.defineProperty(window.history, "state", {
      value: originalState,
      configurable: true,
      writable: true,
    });
  });
});
