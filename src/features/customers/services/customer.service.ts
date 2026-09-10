import { apiClient } from "@/lib/api/client";
import {
  CUSTOMER_DEFAULTS,
  CUSTOMER_ENDPOINTS,
  CUSTOMER_FILTER_STATUS,
} from "../constants/customer.constants";
import type {
  CustomersApiResponse,
  CustomersListData,
  GetCustomersParams,
  UpdateCustomerStatusInput,
  UpdateCustomerStatusResponse,
} from "../types/customer.types";

export const customerService = {
  /**
   * Fetch paginated customer records with optional search, status filtering, and sorting
   */
  async getCustomers(params?: GetCustomersParams): Promise<CustomersListData> {
    const searchParams: Record<string, string | number> = {
      page: params?.page ?? CUSTOMER_DEFAULTS.PAGE,
      limit: params?.limit ?? CUSTOMER_DEFAULTS.LIMIT,
      sortBy: params?.sortBy ?? CUSTOMER_DEFAULTS.SORT_BY,
      sortOrder: params?.sortOrder ?? CUSTOMER_DEFAULTS.SORT_ORDER,
    };

    if (params?.status && params.status !== CUSTOMER_FILTER_STATUS.ALL) {
      searchParams.status = params.status;
    }

    if (params?.search?.trim()) {
      searchParams.search = params.search.trim();
    }

    const response = await apiClient
      .get(CUSTOMER_ENDPOINTS.LIST, {
        searchParams,
      })
      .json<CustomersApiResponse>();

    return response.data;
  },

  /**
   * Update customer account status (e.g. Block or Unblock)
   */
  async updateCustomerStatus(
    input: UpdateCustomerStatusInput,
  ): Promise<UpdateCustomerStatusResponse["data"]> {
    const response = await apiClient
      .patch(CUSTOMER_ENDPOINTS.STATUS(input.userId), {
        json: { status: input.status },
      })
      .json<UpdateCustomerStatusResponse>();

    return response.data;
  },
};

export const getCustomers = customerService.getCustomers;
export const updateCustomerStatus = customerService.updateCustomerStatus;
