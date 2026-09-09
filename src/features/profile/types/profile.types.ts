import type { Gender } from "../constants/profile.constants";

export type { Gender };

export interface CustomerProfile {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  status: string;
  gender: Gender | null;
  dob: string | null;
  created_at: string;
  updated_at: string;
}

export interface CustomerProfileApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: CustomerProfile;
}

export interface UpdateCustomerProfileDto {
  full_name?: string;
  gender?: Gender | null;
  dob?: string | null;
}
