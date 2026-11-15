import {
  ADMIN_ROUTES,
  CUSTOMER_ROUTES,
  RESTAURANT_ROUTES,
  STAFF_ROUTES,
} from "@/app/router/routes.constants";
import { USER_ROLES } from "@/features/auth/constants/auth.constants";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { redirectToPortalLogin } from "./portal-redirect";

describe("redirectToPortalLogin", () => {
  const originalLocation = window.location;

  beforeEach(() => {
    useAuthStore.getState().clearAuth();
    delete (window as unknown as { location?: unknown }).location;
    window.location = {
      ...originalLocation,
      pathname: "/",
      href: "",
    } as unknown as Location;
  });

  afterAll(() => {
    window.location = originalLocation;
  });

  it("redirects to customer login from home page", () => {
    window.location.pathname = "/";
    redirectToPortalLogin();
    expect(window.location.href).toBe(CUSTOMER_ROUTES.AUTH.LOGIN);
  });

  it("redirects to customer login from /restaurants/:id without misclassifying as restaurant admin", () => {
    window.location.pathname = "/restaurants/a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";
    redirectToPortalLogin();
    expect(window.location.href).toBe(CUSTOMER_ROUTES.AUTH.LOGIN);
  });

  it("redirects to customer login from /restaurants list page", () => {
    window.location.pathname = "/restaurants";
    redirectToPortalLogin();
    expect(window.location.href).toBe(CUSTOMER_ROUTES.AUTH.LOGIN);
  });

  it("redirects to customer login from queue tracker page", () => {
    window.location.pathname = "/restaurants/123/queue/status";
    redirectToPortalLogin();
    expect(window.location.href).toBe(CUSTOMER_ROUTES.AUTH.LOGIN);
  });

  it("redirects to restaurant login from /restaurant/dashboard", () => {
    window.location.pathname = RESTAURANT_ROUTES.DASHBOARD;
    redirectToPortalLogin();
    expect(window.location.href).toBe(RESTAURANT_ROUTES.LOGIN);
  });

  it("redirects to staff login from /staff/queue", () => {
    window.location.pathname = STAFF_ROUTES.QUEUE;
    redirectToPortalLogin();
    expect(window.location.href).toBe(STAFF_ROUTES.LOGIN);
  });

  it("redirects to admin login from /admin/dashboard", () => {
    window.location.pathname = ADMIN_ROUTES.DASHBOARD;
    redirectToPortalLogin();
    expect(window.location.href).toBe(ADMIN_ROUTES.LOGIN);
  });

  it("redirects to customer login when user has CUSTOMER role", () => {
    useAuthStore.getState().setAuth(
      {
        id: "c-1",
        email: "customer@example.com",
        fullName: "Customer",
        role: USER_ROLES.CUSTOMER,
      },
      "token",
    );
    window.location.pathname = "/some-page";
    redirectToPortalLogin();
    expect(window.location.href).toBe(CUSTOMER_ROUTES.AUTH.LOGIN);
  });
});


