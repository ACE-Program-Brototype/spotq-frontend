import { formatPaiseToRupees, mapApiTransactionDetailToDetail } from "./transaction.mapper";

describe("transaction.mapper", () => {
  describe("formatPaiseToRupees", () => {
    it("formats paise amount to INR currency string", () => {
      const formatted = formatPaiseToRupees(86800);
      expect(formatted).toContain("868");
    });

    it("handles 0 and invalid paise gracefully", () => {
      const formatted = formatPaiseToRupees(0);
      expect(formatted).toContain("0.00");
    });
  });

  describe("mapApiTransactionDetailToDetail", () => {
    it("maps wrapped { transaction: ... } backend response to TransactionDetail domain model", () => {
      const rawApiData = {
        transaction: {
          id: "tx-123",
          restaurantId: "rest-1",
          orderId: "order-456",
          orderNumber: "SQ-98214",
          customer: {
            name: "Rahul Sharma",
            phoneMasked: "•••••• 4821",
            tableNumber: "T-04",
            tokenNumber: "TK-28",
          },
          amountPaise: 86800,
          amountFormatted: "₹868.00",
          currency: "INR",
          status: "SUCCESS",
          paymentMethod: "UPI",
          upiVpa: "rahul@okaxis",
          card: null,
          razorpayPaymentId: "pay_OEd1m8F05s9jKa",
          razorpayOrderId: "order_ODZ1k8F05s9jKz",
          bankReference: "429182910291",
          billingBreakdown: {
            subtotalPaise: 82000,
            gstPaise: 4800,
            discountPaise: 0,
            grandTotalPaise: 86800,
          },
          settlement: {
            status: "PENDING_EOD",
            settlementId: null,
            scheduledPayout: "Next Business Day",
          },
          refund: null,
          createdAt: "2026-10-27T14:15:00.000Z",
          updatedAt: "2026-10-27T14:15:00.000Z",
        },
      };

      const result = mapApiTransactionDetailToDetail(rawApiData);

      expect(result.id).toBe("tx-123");
      expect(result.status).toBe("SUCCESS");
      expect(result.order.orderNumber).toBe("SQ-98214");
      expect(result.customer.name).toBe("Rahul Sharma");
      expect(result.customer.contact).toBe("•••••• 4821");
      expect(result.customer.tableNumber).toBe("T-04");
      expect(result.customer.tokenNumber).toBe("TK-28");
      expect(result.financialBreakdown.subtotalPaise).toBe(82000);
      expect(result.financialBreakdown.gstPaise).toBe(4800);
      expect(result.financialBreakdown.totalPaise).toBe(86800);
      expect(result.gateway.paymentId).toBe("pay_OEd1m8F05s9jKa");
      expect(result.gateway.vpaOrCard).toBe("rahul@okaxis");
      expect(result.gateway.bankRrn).toBe("429182910291");
      expect(result.gateway.settlementStatus).toBe("PENDING_EOD");
      expect(result.refund).toBeNull();
    });

    it("maps card payment and refund metadata correctly", () => {
      const rawApiData = {
        id: "tx-card-refund",
        amountPaise: 55000,
        amountFormatted: "₹550.00",
        status: "REFUNDED",
        paymentMethod: "CARD",
        card: {
          network: "Visa",
          last4: "4242",
        },
        billingBreakdown: {
          subtotalPaise: 50000,
          gstPaise: 2500,
          discountPaise: 5000,
          grandTotalPaise: 47500,
        },
        refund: {
          id: "rfnd-999",
          razorpayRefundId: "rfnd_U3ZRGR",
          amountPaise: 47500,
          amountFormatted: "₹475.00",
          status: "PROCESSED",
          reason: "Order cancelled",
          createdAt: "2026-10-27T15:00:00.000Z",
        },
        createdAt: "2026-10-27T14:30:00.000Z",
      };

      const result = mapApiTransactionDetailToDetail(rawApiData);

      expect(result.gateway.vpaOrCard).toBe("Visa •••• 4242");
      expect(result.refund).toEqual({
        id: "rfnd-999",
        amountPaise: 47500,
        amountFormatted: "₹475.00",
        status: "PROCESSED",
        reason: "Order cancelled",
        createdAt: "2026-10-27T15:00:00.000Z",
      });
    });

    it("handles missing customer and order safely with fallback defaults", () => {
      const rawApiData = {
        id: "tx-fallback",
        amountPaise: 10000,
        status: "FAILED",
        createdAt: "2026-10-27T12:00:00.000Z",
      };

      const result = mapApiTransactionDetailToDetail(rawApiData);

      expect(result.customer.name).toBe("Guest Customer");
      expect(result.customer.contact).toBe("N/A");
      expect(result.order.orderNumber).toBe("N/A");
      expect(result.gateway.vpaOrCard).toBe("N/A");
    });
  });
});
