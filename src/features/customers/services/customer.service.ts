import { apiClient } from "@/lib/api/client";
import {
  CUSTOMER_DEFAULTS,
  CUSTOMER_ENDPOINTS,
  CUSTOMER_FILTER_STATUS,
} from "../constants/customer.constants";
import type {
  Customer,
  CustomerPagination,
  CustomersApiResponse,
  CustomersListData,
  GetCustomersParams,
  UpdateCustomerStatusInput,
  UpdateCustomerStatusResponse,
} from "../types/customer.types";

interface RawCustomerItem {
  id: string;
  fullname?: string;
  fullName?: string;
  email: string;
  phone?: string | null;
  status: Customer["status"];
  isEmailVerified?: boolean;
  avatarUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
  location?: string | null;
}

interface RawApiResponseData {
  items?: RawCustomerItem[];
  users?: RawCustomerItem[];
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
  pagination?: CustomerPagination;
}

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

    const rawData = response.data as unknown as RawApiResponseData | RawCustomerItem[];
    const rawList: RawCustomerItem[] = Array.isArray(rawData)
      ? rawData
      : rawData?.users || rawData?.items || [];

    const users: Customer[] = rawList.map((item) => ({
      id: item.id,
      email: item.email,
      fullName: item.fullName || item.fullname || item.email.split("@")[0],
      phone: item.phone ?? null,
      status: item.status,
      isEmailVerified: item.isEmailVerified ?? true,
      avatarUrl: item.avatarUrl ?? null,
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: item.updatedAt || new Date().toISOString(),
      location: item.location ?? null,
    }));

    const rootPagination = (response as unknown as { pagination?: CustomerPagination }).pagination;
    const paginationSource = !Array.isArray(rawData) ? rawData?.pagination : undefined;

    const total =
      paginationSource?.total ??
      rootPagination?.total ??
      (!Array.isArray(rawData) ? rawData?.total : undefined) ??
      users.length;

    const page =
      paginationSource?.page ??
      rootPagination?.page ??
      (!Array.isArray(rawData) ? rawData?.page : undefined) ??
      params?.page ??
      CUSTOMER_DEFAULTS.PAGE;

    const limit =
      paginationSource?.limit ??
      rootPagination?.limit ??
      (!Array.isArray(rawData) ? rawData?.limit : undefined) ??
      params?.limit ??
      CUSTOMER_DEFAULTS.LIMIT;

    const totalPages =
      paginationSource?.totalPages ??
      rootPagination?.totalPages ??
      (!Array.isArray(rawData) ? rawData?.totalPages : undefined) ??
      (Math.ceil(total / limit) || (users.length > 0 ? 1 : 0));

    return {
      users,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
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
