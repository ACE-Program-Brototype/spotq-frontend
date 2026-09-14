import type {
  CustomerFilterStatusType,
  CustomerSortByType,
  CustomerSortOrderType,
  CustomerStatusType,
} from "../constants/customer.constants";

export interface Customer {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  status: CustomerStatusType;
  isEmailVerified: boolean;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
  location?: string | null;
}

export interface CustomerPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface GetCustomersParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: CustomerFilterStatusType;
  sortBy?: CustomerSortByType;
  sortOrder?: CustomerSortOrderType;
}

export interface CustomersListData {
  users: Customer[];
  pagination: CustomerPagination;
}

export interface CustomersApiResponse {
  success: boolean;
  message: string;
  data: CustomersListData;
  statusCode: number;
}

export interface UpdateCustomerStatusInput {
  userId: string;
  status: CustomerStatusType;
}

export interface UpdateCustomerStatusResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    status: CustomerStatusType;
    updatedAt: string;
  };
  statusCode: number;
}
