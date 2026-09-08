import { customerRoutes } from "./customer.routes";

describe("customerRoutes structure", () => {
  it("defines customer layout routes, auth routes, and legal routes", () => {
    const layoutGroup = customerRoutes[0];
    expect(layoutGroup.children?.[0].path).toBe("/");
    expect(layoutGroup.children?.[1].path).toBe("/about");
    const profileGroup = layoutGroup.children?.[2];
    expect(profileGroup?.path).toBe("/profile");
    expect(profileGroup?.children?.[0].index).toBe(true);
    expect(profileGroup?.children?.[1].path).toBe("edit");

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
