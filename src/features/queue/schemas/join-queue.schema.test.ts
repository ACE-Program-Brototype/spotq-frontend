import { formatFullPhone, isValidLocalPhone, joinQueueSchema } from "./join-queue.schema";

describe("joinQueueSchema", () => {
  const validData = {
    guestName: "Alice Walker",
    countryCode: "+91",
    phone: "9876543210",
    partySize: 3,
    specialNotes: "Window seating preferred",
  };

  it("passes with valid inputs", () => {
    const res = joinQueueSchema.safeParse(validData);
    expect(res.success).toBe(true);
  });

  it("fails if guestName is empty or under 2 characters", () => {
    const res1 = joinQueueSchema.safeParse({ ...validData, guestName: "   " });
    expect(res1.success).toBe(false);

    const res2 = joinQueueSchema.safeParse({ ...validData, guestName: "A" });
    expect(res2.success).toBe(false);
  });

  it("fails if guestName exceeds 50 characters", () => {
    const res = joinQueueSchema.safeParse({
      ...validData,
      guestName: "A".repeat(51),
    });
    expect(res.success).toBe(false);
  });

  it("validates Indian (+91) phone numbers correctly", () => {
    expect(isValidLocalPhone("9876543210", "+91")).toBe(true);
    expect(isValidLocalPhone("8123456789", "+91")).toBe(true);
    expect(isValidLocalPhone("5123456789", "+91")).toBe(false); // starts with 5
    expect(isValidLocalPhone("12345", "+91")).toBe(false);
  });

  it("validates non-+91 international numbers", () => {
    expect(isValidLocalPhone("4155552671", "+1")).toBe(true);
    expect(isValidLocalPhone("123", "+1")).toBe(false); // too short
  });

  it("validates partySize limits (1 - 20)", () => {
    expect(joinQueueSchema.safeParse({ ...validData, partySize: 0 }).success).toBe(false);
    expect(joinQueueSchema.safeParse({ ...validData, partySize: 1 }).success).toBe(true);
    expect(joinQueueSchema.safeParse({ ...validData, partySize: 20 }).success).toBe(true);
    expect(joinQueueSchema.safeParse({ ...validData, partySize: 21 }).success).toBe(false);
  });

  it("formats full phone numbers with country prefix", () => {
    expect(formatFullPhone("+91", "9876543210")).toBe("+919876543210");
    expect(formatFullPhone("+1", "415-555-2671")).toBe("+14155552671");
  });
});
