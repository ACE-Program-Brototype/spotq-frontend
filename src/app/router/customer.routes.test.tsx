import { customerRoutes } from "./customer.routes";

describe("customerRoutes structure", () => {
  it("defines customer layout routes, auth routes, and legal routes", () => {
    const layoutGroup = customerRoutes[0];
    expect(layoutGroup.children?.map((child) => child.path)).toEqual(["/", "/about"]);

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
    expect(standalonePaths).toEqual([
      "/terms",
      "/terms-and-conditions",
      "/privacy",
      "/privacy-policy",
    ]);
  });
});
