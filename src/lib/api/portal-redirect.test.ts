import { getPortalLoginRedirect } from "./portal-redirect";
import {
  ADMIN_ROUTES,
  CUSTOMER_ROUTES,
  RESTAURANT_ROUTES,
  STAFF_ROUTES,
} from "@/app/router/routes.constants";

describe("getPortalLoginRedirect", () => {
  it("redirects to restaurant login when visiting partner portal paths", () => {
    expect(getPortalLoginRedirect("/restaurant")).toBe(RESTAURANT_ROUTES.LOGIN);
    expect(getPortalLoginRedirect("/restaurant/dashboard")).toBe(RESTAURANT_ROUTES.LOGIN);
    expect(getPortalLoginRedirect("/restaurant/menu/items")).toBe(RESTAURANT_ROUTES.LOGIN);
  });

  it("does NOT redirect to restaurant login when visiting customer /restaurants paths", () => {
    expect(getPortalLoginRedirect("/restaurants")).toBe(CUSTOMER_ROUTES.AUTH.LOGIN);
    expect(getPortalLoginRedirect("/restaurants/res-123")).toBe(CUSTOMER_ROUTES.AUTH.LOGIN);
    expect(getPortalLoginRedirect("/restaurants/res-123/menu")).toBe(CUSTOMER_ROUTES.AUTH.LOGIN);
  });

  it("redirects to admin login when visiting /admin paths", () => {
    expect(getPortalLoginRedirect("/admin")).toBe(ADMIN_ROUTES.LOGIN);
    expect(getPortalLoginRedirect("/admin/restaurants")).toBe(ADMIN_ROUTES.LOGIN);
  });

  it("redirects to staff login when visiting /staff paths", () => {
    expect(getPortalLoginRedirect("/staff")).toBe(STAFF_ROUTES.LOGIN);
    expect(getPortalLoginRedirect("/staff/orders")).toBe(STAFF_ROUTES.LOGIN);
  });

  it("redirects to customer login when visiting root or other customer paths", () => {
    expect(getPortalLoginRedirect("/")).toBe(CUSTOMER_ROUTES.AUTH.LOGIN);
    expect(getPortalLoginRedirect("/about")).toBe(CUSTOMER_ROUTES.AUTH.LOGIN);
    expect(getPortalLoginRedirect("/profile")).toBe(CUSTOMER_ROUTES.AUTH.LOGIN);
    expect(getPortalLoginRedirect("/cart")).toBe(CUSTOMER_ROUTES.AUTH.LOGIN);
  });

  it("returns empty string if already on the portal's login page", () => {
    expect(getPortalLoginRedirect(CUSTOMER_ROUTES.AUTH.LOGIN)).toBe("");
    expect(getPortalLoginRedirect(ADMIN_ROUTES.LOGIN)).toBe("");
    expect(getPortalLoginRedirect(STAFF_ROUTES.LOGIN)).toBe("");
    expect(getPortalLoginRedirect(RESTAURANT_ROUTES.LOGIN)).toBe("");
  });
});
