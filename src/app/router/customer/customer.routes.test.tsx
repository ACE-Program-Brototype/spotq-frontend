import { customerRoutes } from "./customer.routes";

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
    const ordersGroup = layoutGroup.children?.[5];
    expect(ordersGroup?.path).toBe("/orders");
    expect(ordersGroup?.children?.[0].index).toBe(true);
    expect(layoutGroup.children?.[6].path).toBe("/orders/:orderId/receipt");

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
});
