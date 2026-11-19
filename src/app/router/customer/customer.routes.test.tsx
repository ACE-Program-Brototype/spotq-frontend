import { customerRoutes } from "./customer.routes";
import { CUSTOMER_ROUTES } from "./customer.routes.constants";

describe("customerRoutes structure", () => {
  it("defines landing page route, customer layout routes, auth routes, and legal routes", () => {
    // 1. Landing Page route
    expect(customerRoutes[0].path).toBe("/");

    // 2. CustomerLayout group
    const layoutGroup = customerRoutes[1];
    expect(layoutGroup.children?.[0].path).toBe("/home");
    expect(layoutGroup.children?.[1].path).toBe("restaurants");
    expect(layoutGroup.children?.[2].path).toBe("/restaurants/:id");
    expect(layoutGroup.children?.[3].path).toBe("/about");
    expect(layoutGroup.children?.[4].path).toBe("/cart");
    const profileGroup = layoutGroup.children?.[5];
    expect(profileGroup?.path).toBe("/profile");
    expect(profileGroup?.children?.[0].index).toBe(true);
    expect(profileGroup?.children?.[1].path).toBe("edit");
    expect(profileGroup?.children?.[2].path).toBe("payments");
    expect(layoutGroup.children?.[6].path).toBe("/checkout");
    const ordersGroup = layoutGroup.children?.[7];
    expect(ordersGroup?.path).toBe("/orders");
    expect(ordersGroup?.children?.[0].index).toBe(true);
    const orderDetailsGroup = layoutGroup.children?.[8];
    expect(orderDetailsGroup?.path).toBe("/orders/:orderId");
    expect(orderDetailsGroup?.children?.[0].index).toBe(true);
    expect(layoutGroup.children?.[9].path).toBe("/orders/:orderId/receipt");
    expect(layoutGroup.children?.[10].path).toBe("/restaurants/:restaurantId/queue/status");

    // 3. AuthLayout group
    const authGroup = customerRoutes[2];
    expect(authGroup.children?.map((child) => child.path)).toEqual([
      "/login",
      "/register",
      "registration",
      "/forgot-password",
      "/forgot-password/verify",
      "/forgot-password/reset-password",
      "/verify-otp",
    ]);

    // 4. Standalone legal routes
    const standalonePaths = customerRoutes.slice(3).map((route) => route.path);
    expect(standalonePaths).toEqual(["/terms", "/privacy", "/cookies"]);
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
