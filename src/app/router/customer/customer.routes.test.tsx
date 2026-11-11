import { customerRoutes } from "./customer.routes";
import { CUSTOMER_ROUTES } from "./customer.routes.constants";

describe("customerRoutes structure", () => {
  it("defines customer layout routes, auth routes, and legal routes", () => {
    const layoutGroup = customerRoutes[0];
    expect(layoutGroup.children?.[0].path).toBe("/");
    expect(layoutGroup.children?.[1].path).toBe("/restaurants/:id");
    expect(layoutGroup.children?.[2].path).toBe("/about");
    expect(layoutGroup.children?.[3].path).toBe("/cart");
    const profileGroup = layoutGroup.children?.[4];
    expect(profileGroup?.path).toBe("/profile");
    expect(profileGroup?.children?.[0].index).toBe(true);
    expect(profileGroup?.children?.[1].path).toBe("edit");
    expect(profileGroup?.children?.[2].path).toBe("payments");
    expect(layoutGroup.children?.[5].path).toBe("/checkout");
    const ordersGroup = layoutGroup.children?.[6];
    expect(ordersGroup?.path).toBe("/orders");
    expect(ordersGroup?.children?.[0].index).toBe(true);
    expect(layoutGroup.children?.[7].path).toBe("/orders/:orderId/receipt");
    expect(layoutGroup.children?.[8].path).toBe("/restaurants/:restaurantId/queue/status");

    const authGroup = customerRoutes[1];
    expect(authGroup.children?.map((child) => child.path)).toEqual([
      "/login",
      "/register",
      "/forgot-password",
      "/forgot-password/verify",
      "/forgot-password/reset-password",
      "/verify-otp",
    ]);

    const standalonePaths = customerRoutes.slice(2).map((route) => route.path);
    expect(standalonePaths).toEqual(["/terms", "/privacy", "/cookies"]);
  });

  it("builds queue status route with required restaurantId and queueEntryId", () => {
    expect(CUSTOMER_ROUTES.QUEUE_STATUS("rest-123", "entry 456")).toBe(
      "/restaurants/rest-123/queue/status?queueEntryId=entry%20456",
    );
  });
});
