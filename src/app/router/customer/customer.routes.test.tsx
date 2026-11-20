import { customerRoutes } from "./customer.routes";
import { CUSTOMER_ROUTE_PATHS, CUSTOMER_ROUTES } from "./customer.routes.constants";

describe("customerRoutes structure", () => {
  it("defines landing page route, customer layout routes, auth routes, and legal routes", () => {
    // 1. Landing Page route
    expect(customerRoutes[0].path).toBe(CUSTOMER_ROUTE_PATHS.LANDING);

    // 2. CustomerLayout group
    const layoutGroup = customerRoutes[1];
    expect(layoutGroup.children?.[0].path).toBe(CUSTOMER_ROUTE_PATHS.HOME);
    expect(layoutGroup.children?.[1].path).toBe(CUSTOMER_ROUTE_PATHS.RESTAURANTS);
    expect(layoutGroup.children?.[2].path).toBe(CUSTOMER_ROUTE_PATHS.RESTAURANT_DETAIL);
    expect(layoutGroup.children?.[3].path).toBe(CUSTOMER_ROUTE_PATHS.ABOUT);
    expect(layoutGroup.children?.[4].path).toBe(CUSTOMER_ROUTE_PATHS.CART);
    const profileGroup = layoutGroup.children?.[5];
    expect(profileGroup?.path).toBe(CUSTOMER_ROUTE_PATHS.PROFILE.ROOT);
    expect(profileGroup?.children?.[0].index).toBe(true);
    expect(profileGroup?.children?.[1].path).toBe(CUSTOMER_ROUTE_PATHS.PROFILE.EDIT);
    expect(profileGroup?.children?.[2].path).toBe(CUSTOMER_ROUTE_PATHS.PROFILE.PAYMENTS);
    expect(layoutGroup.children?.[6].path).toBe(CUSTOMER_ROUTE_PATHS.CHECKOUT);
    const ordersGroup = layoutGroup.children?.[7];
    expect(ordersGroup?.path).toBe(CUSTOMER_ROUTE_PATHS.ORDERS);
    expect(ordersGroup?.children?.[0].index).toBe(true);
    const orderDetailsGroup = layoutGroup.children?.[8];
    expect(orderDetailsGroup?.path).toBe(CUSTOMER_ROUTE_PATHS.ORDER_DETAILS);
    expect(orderDetailsGroup?.children?.[0].index).toBe(true);
    expect(layoutGroup.children?.[9].path).toBe(CUSTOMER_ROUTE_PATHS.ORDER_RECEIPT);
    expect(layoutGroup.children?.[10].path).toBe(CUSTOMER_ROUTE_PATHS.QUEUE_STATUS);

    // 3. AuthLayout group
    const authGroup = customerRoutes[2];
    expect(authGroup.children?.map((child) => child.path)).toEqual([
      CUSTOMER_ROUTE_PATHS.AUTH.LOGIN,
      CUSTOMER_ROUTE_PATHS.AUTH.REGISTER,
      CUSTOMER_ROUTE_PATHS.AUTH.REGISTRATION,
      CUSTOMER_ROUTE_PATHS.AUTH.FORGOT_PASSWORD,
      CUSTOMER_ROUTE_PATHS.AUTH.FORGOT_PASSWORD_VERIFY,
      CUSTOMER_ROUTE_PATHS.AUTH.FORGOT_PASSWORD_RESET,
      CUSTOMER_ROUTE_PATHS.AUTH.VERIFY_OTP,
    ]);

    // 4. Standalone legal routes
    const standalonePaths = customerRoutes.slice(3).map((route) => route.path);
    expect(standalonePaths).toEqual([
      CUSTOMER_ROUTE_PATHS.LEGAL.TERMS,
      CUSTOMER_ROUTE_PATHS.LEGAL.PRIVACY,
      CUSTOMER_ROUTE_PATHS.LEGAL.COOKIES,
    ]);
  });

  it("builds correct route constants for landing and home", () => {
    expect(CUSTOMER_ROUTES.LANDING).toBe("/");
    expect(CUSTOMER_ROUTES.HOME).toBe("/home");
  });

  it("builds queue status route with required restaurantId and queueEntryId", () => {
    expect(CUSTOMER_ROUTES.QUEUE_STATUS("rest-123", "entry 456")).toBe(
      "/restaurants/rest-123/queue/status?queueEntryId=entry%20456",
    );
  });
});
