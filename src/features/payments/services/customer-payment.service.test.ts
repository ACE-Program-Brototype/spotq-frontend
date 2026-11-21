import { apiClient } from "@/lib/api/client";
import { customerPaymentService } from "./customer-payment.service";

jest.mock("@/lib/api/client", () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

describe("customerPaymentService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getPaymentHistory", () => {
    it("fetches history with default pagination parameters", async () => {
      const mockBackendResponse = {
        success: true,
        data: {
          transactions: [
            {
              transactionId: "tx-1",
              orderId: "order-1",
              orderNumber: "SQ-98214",
              amountPaise: 54000,
              amountInRupees: 540,
              currency: "INR",
              paymentMethod: "UPI",
              status: "SUCCESS",
              createdAt: "2026-10-27T03:35:00.000Z",
              hasInvoice: true,
              invoiceUrl: "https://example.com/invoice.pdf",
              retryEligible: false,
            },
          ],
          pagination: {
            currentPage: 1,
            pageSize: 10,
            totalItems: 1,
            totalPages: 1,
            hasNextPage: false,
            hasPrevPage: false,
          },
        },
      };

      (apiClient.get as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue(mockBackendResponse),
      });

      const result = await customerPaymentService.getPaymentHistory();

      expect(apiClient.get).toHaveBeenCalledWith("payments/history", {
        searchParams: { page: 1, limit: 10 },
      });
      expect(result.transactions).toHaveLength(1);
      expect(result.pagination.totalItems).toBe(1);
    });

    it("maps SUCCESS status to CAPTURED for backend schema compliance", async () => {
      (apiClient.get as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue({ transactions: [], pagination: {} }),
      });

      await customerPaymentService.getPaymentHistory({
        page: 1,
        limit: 10,
        status: "SUCCESS",
      });

      expect(apiClient.get).toHaveBeenCalledWith("payments/history", {
        searchParams: { page: 1, limit: 10, status: "CAPTURED" },
      });
    });

    it("includes status in searchParams when status is not ALL", async () => {
      (apiClient.get as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue({ transactions: [], pagination: {} }),
      });

      await customerPaymentService.getPaymentHistory({
        page: 2,
        limit: 5,
        status: "FAILED",
      });

      expect(apiClient.get).toHaveBeenCalledWith("payments/history", {
        searchParams: { page: 2, limit: 5, status: "FAILED" },
      });
    });

    it("lowercases sortOrder when passing sort parameters", async () => {
      (apiClient.get as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue({ transactions: [], pagination: {} }),
      });

      await customerPaymentService.getPaymentHistory({
        page: 1,
        limit: 10,
        sortBy: "amountPaise",
        sortOrder: "desc",
      });

      expect(apiClient.get).toHaveBeenCalledWith("payments/history", {
        searchParams: {
          page: 1,
          limit: 10,
          sortBy: "amountPaise",
          sortOrder: "desc",
        },
      });
    });

    it("correctly maps backend pagination contract (total, page, limit, hasNext, hasPrev)", async () => {
      const mockBackendResponse = {
        success: true,
        data: {
          transactions: [
            {
              transactionId: "d3793c5e-faae-4f35-b511-aee47c81efca",
              orderId: "ce559b09-a501-4265-96d3-1f4e046014f5",
              amountPaise: 41450,
              amountInRupees: 414.5,
              currency: "INR",
              paymentMethod: "UPI",
              status: "CAPTURED",
              createdAt: "2026-11-06T11:15:45.381Z",
              hasInvoice: true,
              invoiceUrl: "/api/v1/payments/transactions/d3793c5e/invoice",
              retryEligible: false,
            },
          ],
          pagination: {
            total: 6,
            page: 1,
            limit: 10,
            totalPages: 1,
            hasNext: false,
            hasPrev: false,
          },
        },
      };

      (apiClient.get as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue(mockBackendResponse),
      });

      const result = await customerPaymentService.getPaymentHistory();

      expect(result.pagination.totalItems).toBe(6);
      expect(result.pagination.currentPage).toBe(1);
      expect(result.pagination.pageSize).toBe(10);
      expect(result.pagination.hasNextPage).toBe(false);
      expect(result.pagination.hasPrevPage).toBe(false);
    });
  });

  describe("retryPayment", () => {
    it("calls retry endpoint and returns data", async () => {
      const mockRetryData = {
        transactionId: "tx-failed",
        orderId: "order-1",
        razorpayOrderId: "order_EK98a123cd45",
        amountPaise: 54000,
        amountInRupees: 540,
        currency: "INR",
        keyId: "rzp_test_SpotQKey123",
      };

      (apiClient.post as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue({
          success: true,
          message: "Payment retry initiated successfully",
          data: mockRetryData,
        }),
      });

      const result = await customerPaymentService.retryPayment("tx-failed");

      expect(apiClient.post).toHaveBeenCalledWith("payments/transactions/tx-failed/retry");
      expect(result.razorpayOrderId).toBe("order_EK98a123cd45");
    });

    it("throws error when response data is missing", async () => {
      (apiClient.post as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue({ success: false, message: "Order expired" }),
      });

      await expect(customerPaymentService.retryPayment("tx-expired")).rejects.toThrow(
        "Order expired",
      );
    });
  });

  describe("verifyPayment", () => {
    it("posts verification payload to verify endpoint", async () => {
      const payload = {
        orderId: "order-1",
        razorpayOrderId: "rzp_ord_1",
        razorpayPaymentId: "rzp_pay_1",
        razorpaySignature: "sig_1",
      };

      (apiClient.post as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue({ success: true, message: "Verified" }),
      });

      const response = await customerPaymentService.verifyPayment(payload);

      expect(apiClient.post).toHaveBeenCalledWith("payments/orders/verify", {
        json: payload,
      });
      expect(response.success).toBe(true);
    });
  });

  describe("getInvoiceDownloadUrl", () => {
    it("requests invoice endpoint by transaction ID and returns presigned URL", async () => {
      (apiClient.get as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue({
          success: true,
          data: { downloadUrl: "https://spotq-invoices.s3.amazonaws.com/generated.pdf" },
        }),
      });

      const result = await customerPaymentService.getInvoiceDownloadUrl("tx-123");

      expect(apiClient.get).toHaveBeenCalledWith("payments/transactions/tx-123/invoice");
      expect(result).toBe("https://spotq-invoices.s3.amazonaws.com/generated.pdf");
    });

    it("normalizes full api path and returns presigned URL", async () => {
      (apiClient.get as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue({
          success: true,
          data: { url: "https://spotq-invoices.s3.amazonaws.com/from-path.pdf" },
        }),
      });

      const result = await customerPaymentService.getInvoiceDownloadUrl(
        "/api/v1/payments/transactions/tx-abc/invoice",
      );

      expect(apiClient.get).toHaveBeenCalledWith("payments/transactions/tx-abc/invoice");
      expect(result).toBe("https://spotq-invoices.s3.amazonaws.com/from-path.pdf");
    });

    it("throws error when endpoint does not return a download url", async () => {
      (apiClient.get as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue({
          success: false,
          message: "Invoice not ready",
        }),
      });

      await expect(customerPaymentService.getInvoiceDownloadUrl("tx-missing")).rejects.toThrow(
        "Invoice not ready",
      );
    });
  });
});
