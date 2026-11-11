import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { useAuthStore } from "@/features/auth/store/auth.store";
import { useActiveCustomerQueue } from "@/features/queue";
import CustomerLayout from "./CustomerLayout";

jest.mock("@/features/auth/context/push-notification.context", () => ({
  usePushNotification: () => ({
    isSupported: true,
    permission: "granted",
    isSubscribed: true,
    isLoading: false,
    error: null,
    requestPermission: jest.fn(),
    dismissBanner: jest.fn(),
  }),
}));

jest.mock("@/features/cart/store/cart.store", () => ({
  useCartStore: (selector: (state: { totalCount: number }) => unknown) =>
    selector({ totalCount: 2 }),
}));

jest.mock("@/features/queue", () => ({
  CustomerRingAlertContainer: () => <div data-testid="ring-alert-container">Ring Alert</div>,
  ActiveQueueFloatingPill: () => <div data-testid="floating-pill">Floating Pill</div>,
  useActiveCustomerQueue: jest.fn(),
}));

jest.mock("@/components/layout/CustomerNavbar", () => ({
  CustomerNavbar: () => <header data-testid="customer-navbar">Navbar</header>,
  CustomerMobileNav: () => <nav data-testid="customer-mobile-nav">Mobile Nav</nav>,
}));

jest.mock("@/components/layout/CustomerFooter", () => ({
  CustomerFooter: () => <footer data-testid="customer-footer">Footer</footer>,
}));

describe("CustomerLayout", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.getState().clearAuth();
  });

  const renderLayout = (initialRoute: string) => {
    return render(
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route element={<CustomerLayout />}>
            <Route path="/home" element={<div>Home Page Content</div>} />
            <Route path="/restaurants/:id" element={<div>Restaurant Detail Page</div>} />
            <Route
              path="/restaurants/:id/queue/status"
              element={<div>Queue Tracker Page Content</div>}
            />
          </Route>
          <Route path="/admin" element={<div>Admin Console</div>} />
          <Route path="/staff/dashboard" element={<div>Staff Portal</div>} />
        </Routes>
      </MemoryRouter>,
    );
  };

  it("renders layout shell, outlet content, and ring alert container on non-tracker pages", () => {
    renderLayout("/restaurants/rest-1");

    expect(screen.getByTestId("customer-navbar")).toBeInTheDocument();
    expect(screen.getByTestId("customer-footer")).toBeInTheDocument();
    expect(screen.getByText("Restaurant Detail Page")).toBeInTheDocument();
    expect(screen.getByTestId("ring-alert-container")).toBeInTheDocument();
    expect(useActiveCustomerQueue).toHaveBeenCalled();
  });

  it("does not render ring alert container on queue status tracker page to prevent duplicate websocket connections", () => {
    renderLayout("/restaurants/rest-1/queue/status?queueEntryId=entry-123");

    expect(screen.getByText("Queue Tracker Page Content")).toBeInTheDocument();
    expect(screen.queryByTestId("ring-alert-container")).not.toBeInTheDocument();
  });

  it("redirects non-customer users to their role home page", () => {
    useAuthStore.getState().setUser({
      _id: "staff-1",
      name: "Staff Member",
      email: "staff@example.com",
      role: "STAFF",
      created_at: "2026-08-18T21:59:52.665Z",
    });

    renderLayout("/home");

    expect(screen.getByText("Staff Portal")).toBeInTheDocument();
    expect(screen.queryByText("Home Page Content")).not.toBeInTheDocument();
  });
});
