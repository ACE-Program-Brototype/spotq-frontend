import { verifyOtpSchema } from "./verify-otp.schema";

describe("verifyOtpSchema", () => {
  it("passes with a valid 6-digit numeric OTP", () => {
    const result = verifyOtpSchema.safeParse({
      otp: "123456",
    });
    expect(result.success).toBe(true);
  });

  it("fails when OTP is less than 6 digits", () => {
    const result = verifyOtpSchema.safeParse({
      otp: "12345",
    });
    expect(result.success).toBe(false);
  });

  it("fails when OTP contains non-numeric characters", () => {
    const result = verifyOtpSchema.safeParse({
      otp: "12345a",
    });
    expect(result.success).toBe(false);
  });

  it("fails when OTP is empty", () => {
    const result = verifyOtpSchema.safeParse({
      otp: "",
    });
    expect(result.success).toBe(false);
  });
});
