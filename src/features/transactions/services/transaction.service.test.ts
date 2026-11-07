import { apiClient } from "@/lib/api/client";
import { TRANSACTION_DEFAULTS, TRANSACTION_ENDPOINTS } from "../constants/transaction.constants";
import { transactionService } from "./transaction.service";

jest.mock("@/lib/api/client", () => ({
  apiClient: {
    get: jest.fn(),
  },
}));

describe("transactionService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getTransactions", () => {
    it("calls apiClient.get with default pagination params and maps totalRecords to totalItems", async () => {
      const mockApiResponse = {
        success: true,
        message: "Transactions retrieved successfully",
        data: {
          transactions: [
            {
              id: "8e329a17-6421-4f3a-bfda-90e94bb10022",
              orderId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
              orderNumber: "SQ-98214",
              customerName: "Rahul Sharma",
              razorpayPaymentId: "pay_OEd1m8F05s9jKa",
              paymentMethod: "UPI",
              amountPaise: 86800,
              amountFormatted: "₹868.00",
              status: "SUCCESS",
              settlementStatus: "PENDING_EOD",
              createdAt: "2026-10-27T14:15:00.000Z",
            },
          ],
          pagination: {
            currentPage: 1,
            totalPages: 1,
            totalRecords: 1,
            limit: 20,
          },
        },
      };

      (apiClient.get as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue(mockApiResponse),
      });

      const result = await transactionService.getTransactions();

      expect(apiClient.get).toHaveBeenCalledWith(TRANSACTION_ENDPOINTS.BASE, {
        searchParams: {
          page: TRANSACTION_DEFAULTS.PAGE,
          limit: TRANSACTION_DEFAULTS.LIMIT,
        },
      });
      expect(result.transactions).toEqual(mockApiResponse.data.transactions);
      expect(result.pagination.totalItems).toBe(1);
      expect(result.pagination.currentPage).toBe(1);
      expect(result.pagination.totalPages).toBe(1);
      expect(result.pagination.hasNextPage).toBe(false);
      expect(result.pagination.hasPrevPage).toBe(false);
    });

    it("serializes search, filters, date range, and sort params correctly", async () => {
      const mockApiResponse = {
        success: true,
        message: "Filtered transactions",
        data: {
          transactions: [],
          pagination: {
            currentPage: 2,
            totalPages: 5,
            totalRecords: 50,
            limit: 10,
          },
        },
      };

      (apiClient.get as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue(mockApiResponse),
      });

      const result = await transactionService.getTransactions({
        page: 2,
        limit: 10,
        search: "Rahul",
        status: "SUCCESS",
        method: "UPI",
        startDate: "2026-10-01",
        endDate: "2026-10-28",
        sortBy: "amountPaise",
        sortOrder: "asc",
      });

      expect(apiClient.get).toHaveBeenCalledWith(TRANSACTION_ENDPOINTS.BASE, {
        searchParams: {
          page: 2,
          limit: 10,
          search: "Rahul",
          status: "SUCCESS",
          method: "UPI",
          startDate: "2026-10-01",
          endDate: "2026-10-28",
          sortBy: "amountPaise",
          sortOrder: "asc",
        },
      });
      expect(result.pagination.totalItems).toBe(50);
      expect(result.pagination.hasNextPage).toBe(true);
      expect(result.pagination.hasPrevPage).toBe(true);
    });

    it("throws error if response data is missing", async () => {
      (apiClient.get as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue({
          success: false,
          message: "Database connection failed",
        }),
      });

      await expect(transactionService.getTransactions()).rejects.toThrow(
        "Database connection failed",
      );
    });
  });

  describe("getTransactionDetail", () => {
    it("calls apiClient.get with valid transaction ID and returns mapped details", async () => {
      const mockDetailResponse = {
        success: true,
        message: "Transaction details retrieved successfully",
        data: {
          transaction: {
            id: "8e329a17-6421-4f3a-bfda-90e94bb10022",
            orderId: "order-1",
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
        },
      };

      (apiClient.get as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue(mockDetailResponse),
      });

      const result = await transactionService.getTransactionDetail(
        "8e329a17-6421-4f3a-bfda-90e94bb10022",
      );

      expect(apiClient.get).toHaveBeenCalledWith(
        TRANSACTION_ENDPOINTS.DETAIL("8e329a17-6421-4f3a-bfda-90e94bb10022"),
      );
      expect(result.id).toBe("8e329a17-6421-4f3a-bfda-90e94bb10022");
      expect(result.order.orderNumber).toBe("SQ-98214");
      expect(result.customer.name).toBe("Rahul Sharma");
      expect(result.customer.contact).toBe("•••••• 4821");
      expect(result.financialBreakdown.subtotalPaise).toBe(82000);
      expect(result.gateway.paymentId).toBe("pay_OEd1m8F05s9jKa");
    });

    it("throws error when transaction ID is empty", async () => {
      await expect(transactionService.getTransactionDetail("   ")).rejects.toThrow(
        "Transaction ID is required",
      );
    });
  });
});
