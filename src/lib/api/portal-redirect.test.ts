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
  let mockWindow: { location: { pathname: string; href: string } };

  beforeEach(() => {
    useAuthStore.getState().clearAuth();
    mockWindow = {
      location: {
        pathname: "/",
        href: "",
      },
    };
  });

  it("redirects to customer login from home page", () => {
    mockWindow.location.pathname = "/";
    redirectToPortalLogin(mockWindow as unknown as Window);
    expect(mockWindow.location.href).toBe(CUSTOMER_ROUTES.AUTH.LOGIN);
  });

  it("redirects to customer login from /restaurants/:id without misclassifying as restaurant admin", () => {
    mockWindow.location.pathname = "/restaurants/a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";
    redirectToPortalLogin(mockWindow as unknown as Window);
    expect(mockWindow.location.href).toBe(CUSTOMER_ROUTES.AUTH.LOGIN);
  });

  it("redirects to customer login from /restaurants list page", () => {
    mockWindow.location.pathname = "/restaurants";
    redirectToPortalLogin(mockWindow as unknown as Window);
    expect(mockWindow.location.href).toBe(CUSTOMER_ROUTES.AUTH.LOGIN);
  });

  it("redirects to customer login from queue tracker page", () => {
    mockWindow.location.pathname = "/restaurants/123/queue/status";
    redirectToPortalLogin(mockWindow as unknown as Window);
    expect(mockWindow.location.href).toBe(CUSTOMER_ROUTES.AUTH.LOGIN);
  });

  it("redirects to restaurant login from /restaurant/dashboard", () => {
    mockWindow.location.pathname = RESTAURANT_ROUTES.DASHBOARD;
    redirectToPortalLogin(mockWindow as unknown as Window);
    expect(mockWindow.location.href).toBe(RESTAURANT_ROUTES.LOGIN);
  });

  it("redirects to staff login from /staff/queue", () => {
    mockWindow.location.pathname = STAFF_ROUTES.QUEUE;
    redirectToPortalLogin(mockWindow as unknown as Window);
    expect(mockWindow.location.href).toBe(STAFF_ROUTES.LOGIN);
  });

  it("redirects to admin login from /admin/dashboard", () => {
    mockWindow.location.pathname = ADMIN_ROUTES.DASHBOARD;
    redirectToPortalLogin(mockWindow as unknown as Window);
    expect(mockWindow.location.href).toBe(ADMIN_ROUTES.LOGIN);
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
    mockWindow.location.pathname = "/some-page";
    redirectToPortalLogin(mockWindow as unknown as Window);
    expect(mockWindow.location.href).toBe(CUSTOMER_ROUTES.AUTH.LOGIN);
  });
});
