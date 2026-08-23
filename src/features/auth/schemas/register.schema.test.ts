import { registerSchema } from "./register.schema";

describe("registerSchema", () => {

    it("accepts valid registration data", () => {
        const result = registerSchema.safeParse({
            fullName: "Alex Johnson",
            email: "alex@example.com",
            phoneNumber: "9876543210",
            password: "Password@123",
            confirmPassword: "Password@123",
            termsAccepted: true,
        });

        expect(result.success).toBe(true);
    });


    it("rejects a short full name", () => {
        const result = registerSchema.safeParse({
            fullName: "Al",
            email: "alex@example.com",
            phoneNumber: "9876543210",
            password: "Password@123",
            confirmPassword: "Password@123",
            termsAccepted: true,
        });

        expect(result.success).toBe(false);
    });

    it("rejects a phone number that is not 10 digits", () => {
        const result = registerSchema.safeParse({
            fullName: "Alex Johnson",
            email: "alex@example.com",
            phoneNumber: "12345",
            password: "Password@123",
            confirmPassword: "Password@123",
            termsAccepted: true,
        });

        expect(result.success).toBe(false);
    });

    it("rejects password shorter than 8 characters", () => {
        const result = registerSchema.safeParse({
            fullName: "Alex Johnson",
            email: "alex@example.com",
            phoneNumber: "12345",
            password: "Pass@1",
            confirmPassword: "Pass@1",
            termsAccepted: true,
        });

        expect(result.success).toBe(false);
    });

    it("rejects password without uppercase letter", () => {
        const result = registerSchema.safeParse({
            fullName: "Alex Johnson",
            email: "alex@example.com",
            phoneNumber: "12345",
            password: "password@123",
            confirmPassword: "password@123",
            termsAccepted: true,
        });

        expect(result.success).toBe(false);
    });

    it("rejects password without lowercase letter", () => {
        const result = registerSchema.safeParse({
            fullName: "Alex Johnson",
            email: "alex@example.com",
            phoneNumber: "12345",
            password: "PASSWORD@123",
            confirmPassword: "PASSWORD@123",
            termsAccepted: true,
        });

        expect(result.success).toBe(false);
    });

    it("rejects password without a number", () => {
        const result = registerSchema.safeParse({
            fullName: "Alex Johnson",
            email: "alex@example.com",
            phoneNumber: "12345",
            password: "Password@",
            confirmPassword: "Password@",
            termsAccepted: true,
        });

        expect(result.success).toBe(false);
    });

    it("rejects password without a special character", () => {
        const result = registerSchema.safeParse({
            fullName: "Alex Johnson",
            email: "alex@example.com",
            phoneNumber: "12345",
            password: "Password123",
            confirmPassword: "Password123",
            termsAccepted: true,
        });

        expect(result.success).toBe(false);
    });

    it("rejects password without same with confirm password", () => {
        const result = registerSchema.safeParse({
            fullName: "Alex Johnson",
            email: "alex@example.com",
            phoneNumber: "12345",
            password: "Password@123",
            confirmPassword: "Passwod@456",
            termsAccepted: true,
        });

        expect(result.success).toBe(false);
    });


    it("rejects when terms are not accepted", () => {
        const result = registerSchema.safeParse({
            fullName: "Alex Johnson",
            email: "alex@example.com",
            phoneNumber: "9876543210",
            password: "Password@123",
            confirmPassword: "Password@123",
            termsAccepted: false,
        });

        expect(result.success).toBe(false);
    });

});

