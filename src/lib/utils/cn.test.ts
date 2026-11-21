import { cn } from "./cn";

describe("cn utility", () => {
  it("merges class names correctly", () => {
    expect(cn("px-2", "py-1")).toBe("px-2 py-1");
  });

  it("handles conditional classes and falsy values", () => {
    expect(cn("base-class", false && "hidden", null, undefined, "active")).toBe(
      "base-class active",
    );
  });

  it("resolves conflicting Tailwind CSS classes", () => {
    expect(cn("p-4", "p-2")).toBe("p-2");
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
  });
});
