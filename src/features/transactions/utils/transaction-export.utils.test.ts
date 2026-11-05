import type { PaymentTransactionItem } from "../types/transaction.types";
import {
  downloadTransactionsCsv,
  escapeCsvField,
  generateTransactionsCsvString,
} from "./transaction-export.utils";

describe("transaction-export.utils", () => {
  describe("escapeCsvField", () => {
    it("handles null and undefined gracefully", () => {
      expect(escapeCsvField(null)).toBe("");
      expect(escapeCsvField(undefined)).toBe("");
    });

    it("returns plain string if no commas or quotes", () => {
      expect(escapeCsvField("Rahul Sharma")).toBe("Rahul Sharma");
      expect(escapeCsvField(12345)).toBe("12345");
    });

    it("escapes fields containing commas or quotes according to RFC-4180", () => {
      expect(escapeCsvField("Sharma, Rahul")).toBe('"Sharma, Rahul"');
      expect(escapeCsvField('Quotes "Inside"')).toBe('"Quotes ""Inside"""');
    });

    it("sanitizes potential formula injection characters (=, +, -, @, \\t, \\r)", () => {
      expect(escapeCsvField("=SUM(A1:A10)")).toBe("'=SUM(A1:A10)");
      expect(escapeCsvField("+12345")).toBe("'+12345");
      expect(escapeCsvField("-500")).toBe("'-500");
      expect(escapeCsvField("@admin")).toBe("'@admin");
      expect(escapeCsvField("\tTabbed")).toBe("'\tTabbed");
      expect(escapeCsvField('=cmd|"calc"')).toBe('"\'=cmd|""calc"""');
    });
  });

  describe("generateTransactionsCsvString", () => {
    it("generates correct CSV headers and data rows", () => {
      const mockItems: PaymentTransactionItem[] = [
        {
          id: "tx-1",
          orderId: "order-1",
          orderNumber: "SQ-98214",
          customerName: "Rahul Sharma",
          razorpayPaymentId: "pay_123",
          paymentMethod: "UPI",
          amountPaise: 86800,
          amountFormatted: "₹868.00",
          status: "SUCCESS",
          settlementStatus: "PENDING_EOD",
          createdAt: "2026-10-27T14:15:00.000Z",
        },
      ];

      const csv = generateTransactionsCsvString(mockItems);
      const lines = csv.split("\r\n");

      expect(lines.length).toBe(2);
      expect(lines[0]).toContain("Date & Time,Transaction ID,Order Number");
      expect(lines[1]).toContain(
        "tx-1,SQ-98214,Rahul Sharma,UPI,868.00,SUCCESS,PENDING_EOD,pay_123",
      );
    });
  });

  describe("downloadTransactionsCsv", () => {
    it("returns false when transactions array is empty", () => {
      expect(downloadTransactionsCsv([])).toBe(false);
    });

    it("creates download link and clicks it when data is provided", () => {
      const mockItems: PaymentTransactionItem[] = [
        {
          id: "tx-1",
          orderId: "order-1",
          orderNumber: "SQ-98214",
          customerName: "Rahul Sharma",
          razorpayPaymentId: "pay_123",
          paymentMethod: "UPI",
          amountPaise: 86800,
          amountFormatted: "₹868.00",
          status: "SUCCESS",
          settlementStatus: "PENDING_EOD",
          createdAt: "2026-10-27T14:15:00.000Z",
        },
      ];

      // Mock DOM URL and link click
      const originalCreateObjectURL = URL.createObjectURL;
      const originalRevokeObjectURL = URL.revokeObjectURL;
      URL.createObjectURL = jest.fn(() => "blob:test");
      URL.revokeObjectURL = jest.fn();

      const clickSpy = jest
        .spyOn(HTMLAnchorElement.prototype, "click")
        .mockImplementation(() => {});

      const result = downloadTransactionsCsv(mockItems);

      expect(result).toBe(true);
      expect(clickSpy).toHaveBeenCalled();

      URL.createObjectURL = originalCreateObjectURL;
      URL.revokeObjectURL = originalRevokeObjectURL;
      clickSpy.mockRestore();
    });
  });
});
