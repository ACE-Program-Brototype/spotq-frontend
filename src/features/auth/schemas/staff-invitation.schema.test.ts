import { acceptInvitationSchema, inviteStaffSchema } from "./staff-invitation.schema";

describe("inviteStaffSchema", () => {
  it("accepts valid email address", () => {
    const res = inviteStaffSchema.safeParse({
      email: "staff.member@spotq.com",
    });
    expect(res.success).toBe(true);
  });

  it("rejects invalid email address", () => {
    const res = inviteStaffSchema.safeParse({
      email: "not-an-email",
    });
    expect(res.success).toBe(false);
  });

  it("rejects empty email", () => {
    const res = inviteStaffSchema.safeParse({
      email: "",
    });
    expect(res.success).toBe(false);
  });
});

describe("acceptInvitationSchema", () => {
  it("accepts valid registration values", () => {
    const res = acceptInvitationSchema.safeParse({
      fullname: "Chef Ramsay",
      phone: "9876543210",
      password: "Password@123",
      confirmPassword: "Password@123",
    });
    expect(res.success).toBe(true);
  });

  it("rejects short name", () => {
    const res = acceptInvitationSchema.safeParse({
      fullname: "A",
      phone: "9876543210",
      password: "Password@123",
      confirmPassword: "Password@123",
    });
    expect(res.success).toBe(false);
  });

  it("rejects non-10 digit phone number", () => {
    const res = acceptInvitationSchema.safeParse({
      fullname: "Chef Ramsay",
      phone: "12345",
      password: "Password@123",
      confirmPassword: "Password@123",
    });
    expect(res.success).toBe(false);
  });

  it("rejects mismatching passwords", () => {
    const res = acceptInvitationSchema.safeParse({
      fullname: "Chef Ramsay",
      phone: "9876543210",
      password: "Password@123",
      confirmPassword: "Password@456",
    });
    expect(res.success).toBe(false);
  });

  it("rejects weak password missing special char", () => {
    const res = acceptInvitationSchema.safeParse({
      fullname: "Chef Ramsay",
      phone: "9876543210",
      password: "Password123",
      confirmPassword: "Password123",
    });
    expect(res.success).toBe(false);
  });
});
