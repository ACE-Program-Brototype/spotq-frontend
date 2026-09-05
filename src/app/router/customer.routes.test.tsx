import { customerRoutes } from "./customer.routes";

describe("customerRoutes structure", () => {
  it("defines about-us, terms, terms-and-conditions, privacy, and privacy-policy routes", () => {
    const paths = customerRoutes.map((route) => route.path);
    expect(paths).toEqual([
      "/about-us",
      "/terms",
      "/terms-and-conditions",
      "/privacy",
      "/privacy-policy",
    ]);
  });
});
