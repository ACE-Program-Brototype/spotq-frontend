import { apiClient } from "@/lib/api/client";
import { restaurantApplicationService } from "./restaurant-application.service";

jest.mock("@/lib/api/client", () => ({
  apiClient: {
    get: jest.fn(),
    patch: jest.fn(),
  },
}));

describe("restaurantApplicationService", () => {
  const mockApplication = {
    id: "app-uuid-1",
    restaurant_name: "GoodVibes Bistro",
    email: "contact@goodvibes.com",
    phone: "+919876543210",
    owner_name: "John Doe",
    owner_email: "owner@goodvibes.com",
    status: "PENDING" as const,
    onboarding_status: "COMPLETED",
    created_at: "2026-09-09T18:58:55.124Z",
    updated_at: "2026-09-14T21:29:24.525Z",
    address: {
      id: "addr-1",
      address_line1: "123 MG Road",
      city: "Kochi",
      state: "Kerala",
      country: "India",
      pincode: "682001",
      latitude: 9.9312,
      longitude: 76.2673,
    },
    documents: [
      {
        id: "doc-1",
        document_type: "FSSAI_LICENSE",
        document_name: "fssai_cert.pdf",
        document_key: "restaurants/app-uuid-1/documents/fssai.pdf",
        verification_status: "PENDING",
        uploaded_at: "2026-09-09T19:10:00.000Z",
      },
    ],
    images: [
      {
        id: "img-1",
        object_key: "restaurants/app-uuid-1/images/facade.jpg",
        display_order: 1,
        created_at: "2026-09-09T19:12:00.000Z",
      },
    ],
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getRestaurantApplications", () => {
    it("fetches applications list successfully and normalizes pagination", async () => {
      const mockApiResponse = {
        success: true,
        message: "Applications fetched",
        data: {
          restaurants: [mockApplication],
          pagination: {
            page: 1,
            limit: 10,
            total: 25,
            totalPages: 3,
            hasNextPage: true,
            hasPrevPage: false,
          },
        },
      };

      (apiClient.get as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue(mockApiResponse),
      });

      const result = await restaurantApplicationService.getRestaurantApplications({
        page: 1,
        limit: 10,
        status: "PENDING",
        search: "GoodVibes",
      });

      expect(apiClient.get).toHaveBeenCalledWith("restaurants/admin/restaurants/applications", {
        searchParams: {
          page: 1,
          limit: 10,
          status: "PENDING",
          search: "GoodVibes",
        },
      });

      expect(result.restaurants).toHaveLength(1);
      expect(result.pagination.total).toBe(25);
      expect(result.pagination.total_pages).toBe(3);
      expect(result.pagination.has_next_page).toBe(true);
    });

    it("throws an error when response is unsuccessful", async () => {
      (apiClient.get as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue({
          success: false,
          message: "Unauthorized",
        }),
      });

      await expect(restaurantApplicationService.getRestaurantApplications()).rejects.toThrow(
        "Unauthorized",
      );
    });
  });

  describe("getRestaurantApplicationById", () => {
    it("fetches single application by ID", async () => {
      (apiClient.get as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue({
          success: true,
          data: mockApplication,
        }),
      });

      const result = await restaurantApplicationService.getRestaurantApplicationById("app-uuid-1");

      expect(apiClient.get).toHaveBeenCalledWith(
        "restaurants/admin/restaurants/applications/app-uuid-1",
      );
      expect(result.restaurant_name).toBe("GoodVibes Bistro");
    });

    it("throws when ID is empty", async () => {
      await expect(restaurantApplicationService.getRestaurantApplicationById("")).rejects.toThrow(
        "Application ID is required.",
      );
    });
  });

  describe("approveRestaurantApplication", () => {
    it("approves application successfully", async () => {
      (apiClient.patch as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue({
          success: true,
          message: "Restaurant application approved successfully.",
          data: {
            id: "app-uuid-1",
            restaurant_name: "GoodVibes Bistro",
            status: "APPROVED",
          },
        }),
      });

      const result = await restaurantApplicationService.approveRestaurantApplication("app-uuid-1");

      expect(apiClient.patch).toHaveBeenCalledWith(
        "restaurants/admin/restaurants/app-uuid-1/approve",
      );
      expect(result.success).toBe(true);
    });

    it("throws when ID is empty", async () => {
      await expect(restaurantApplicationService.approveRestaurantApplication("")).rejects.toThrow(
        "Application ID is required.",
      );
    });
  });

  describe("rejectRestaurantApplication", () => {
    it("rejects application with valid reason", async () => {
      (apiClient.patch as jest.Mock).mockReturnValue({
        json: jest.fn().mockResolvedValue({
          success: true,
          message: "Restaurant application rejected successfully.",
          data: {
            id: "app-uuid-1",
            restaurant_name: "GoodVibes Bistro",
            status: "REJECTED",
          },
        }),
      });

      const result = await restaurantApplicationService.rejectRestaurantApplication({
        restaurantId: "app-uuid-1",
        reason: "FSSAI certificate expired",
      });

      expect(apiClient.patch).toHaveBeenCalledWith(
        "restaurants/admin/restaurants/app-uuid-1/reject",
        { json: { reason: "FSSAI certificate expired" } },
      );
      expect(result.success).toBe(true);
    });

    it("throws when reason is missing or shorter than 5 chars", async () => {
      await expect(
        restaurantApplicationService.rejectRestaurantApplication({
          restaurantId: "app-uuid-1",
          reason: "bad",
        }),
      ).rejects.toThrow("Rejection reason must be at least 5 characters long.");
    });
  });
});
