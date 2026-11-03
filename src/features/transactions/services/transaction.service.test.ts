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
    it("calls apiClient.get with default pagination params when no params provided", async () => {
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
            totalItems: 1,
            limit: 20,
            hasNextPage: false,
            hasPrevPage: false,
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
      expect(result).toEqual(mockApiResponse.data);
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
            totalItems: 50,
            limit: 10,
            hasNextPage: true,
            hasPrevPage: true,
          },
        },
      };

      (apiClient.get as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue(mockApiResponse),
      });

      await transactionService.getTransactions({
        page: 2,
        limit: 10,
        search: "Rahul",
        status: "SUCCESS",
        method: "UPI",
        startDate: "2026-10-01",
        endDate: "2026-10-28",
        minAmount: 50000,
        maxAmount: 100000,
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
          minAmount: 50000,
          maxAmount: 100000,
          sortBy: "amountPaise",
          sortOrder: "asc",
        },
      });
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
    it("calls apiClient.get with valid transaction ID and returns details", async () => {
      const mockDetailResponse = {
        success: true,
        message: "Transaction details retrieved successfully",
        data: {
          id: "8e329a17-6421-4f3a-bfda-90e94bb10022",
          status: "SUCCESS",
          createdAt: "2026-10-27T14:15:00.000Z",
          customer: {
            id: "cust-1",
            name: "Rahul Sharma",
            contact: "•••••• 4821",
            tableNumber: "T-04",
            tokenNumber: "TK-28",
          },
          order: {
            id: "order-1",
            orderNumber: "SQ-98214",
            status: "COMPLETED",
          },
          financialBreakdown: {
            subtotalPaise: 82000,
            subtotalFormatted: "₹820.00",
            gstPaise: 4800,
            gstPercentage: 5,
            gstFormatted: "₹48.00",
            discountPaise: 0,
            discountFormatted: "₹0.00",
            totalPaise: 86800,
            totalFormatted: "₹868.00",
          },
          gateway: {
            name: "Razorpay",
            paymentId: "pay_OEd1m8F05s9jKa",
            orderId: "order_ODZ1k8F05s9jKz",
            method: "UPI",
            vpaOrCard: "rahul@okaxis",
            bankRrn: "429182910291",
            settlementStatus: "PENDING_EOD",
            expectedSettlementDate: "2026-10-28",
          },
          refund: null,
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
      expect(result).toEqual(mockDetailResponse.data);
    });

    it("throws error when transaction ID is empty", async () => {
      await expect(transactionService.getTransactionDetail("   ")).rejects.toThrow(
        "Transaction ID is required",
      );
    });
  });
});
