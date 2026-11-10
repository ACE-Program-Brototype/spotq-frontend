import { adminRoutes } from "./admin.routes";

describe("adminRoutes", () => {
  it("should define admin routes structure", () => {
    expect(adminRoutes).toBeDefined();
    expect(adminRoutes).toHaveLength(2);

    const authSection = adminRoutes[0];
    expect(authSection.children).toBeDefined();
    const authPaths = authSection.children?.map((r) => r.path);
    expect(authPaths).toContain("login");
    expect(authPaths).toContain("forgot-password");

    const protectedSection = adminRoutes[1];
    expect(protectedSection.children).toBeDefined();
    const layoutWrapper = protectedSection.children?.[0];
    expect(layoutWrapper?.children).toBeDefined();
    expect(layoutWrapper?.children?.some((route) => route.path === "finance")).toBe(true);

    const protectedPaths = layoutWrapper?.children?.map((r) => r.path);
    expect(protectedPaths).toContain("dashboard");
    expect(protectedPaths).toContain("restaurants/management");
    expect(protectedPaths).toContain("customers");
    expect(protectedPaths).toContain("customers/:id");
    expect(protectedPaths).toContain("subscribers");
    expect(protectedPaths).toContain("subscribers/:id");
  });
});
