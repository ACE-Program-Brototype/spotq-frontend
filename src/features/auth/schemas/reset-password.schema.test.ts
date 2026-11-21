import { resetPasswordSchema } from "./reset-password.schema";

describe("resetPasswordSchema", () => {
  it("passes with a strong password and matching confirmation", () => {
    const result = resetPasswordSchema.safeParse({
      password: "Password123!",
      confirmPassword: "Password123!",
    });
    expect(result.success).toBe(true);
  });

  it("fails when password is less than 8 characters", () => {
    const result = resetPasswordSchema.safeParse({
      password: "Pass1!",
      confirmPassword: "Pass1!",
    });
    expect(result.success).toBe(false);
  });

  it("fails when missing an uppercase letter", () => {
    const result = resetPasswordSchema.safeParse({
      password: "password123!",
      confirmPassword: "password123!",
    });
    expect(result.success).toBe(false);
  });

  it("fails when missing a number", () => {
    const result = resetPasswordSchema.safeParse({
      password: "Password!",
      confirmPassword: "Password!",
    });
    expect(result.success).toBe(false);
  });

  it("fails when missing a special character", () => {
    const result = resetPasswordSchema.safeParse({
      password: "Password123",
      confirmPassword: "Password123",
    });
    expect(result.success).toBe(false);
  });

  it("fails when passwords do not match", () => {
    const result = resetPasswordSchema.safeParse({
      password: "Password123!",
      confirmPassword: "DifferentPassword123!",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toMatch(/passwords do not match/i);
    }
  });
});
