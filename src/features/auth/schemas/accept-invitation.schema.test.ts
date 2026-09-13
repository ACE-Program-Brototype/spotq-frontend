import { acceptInvitationSchema } from "./accept-invitation.schema";

describe("acceptInvitationSchema", () => {
  const validData = {
    fullname: "John Doe",
    phone: "9876543210",
    password: "Password@123",
    confirmPassword: "Password@123",
  };

  it("passes with valid data", () => {
    const result = acceptInvitationSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("fails when password and confirmPassword do not match", () => {
    const result = acceptInvitationSchema.safeParse({
      ...validData,
      confirmPassword: "DifferentPassword@123",
    });
    expect(result.success).toBe(false);
  });

  it("fails when phone number is not 10 digits", () => {
    const result = acceptInvitationSchema.safeParse({
      ...validData,
      phone: "12345",
    });
    expect(result.success).toBe(false);
  });
});
