/**
 * Customer Profile Types
 */

export interface CustomerProfile {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  status: string;
  gender: "MALE" | "FEMALE" | "OTHER" | null;
  dob: string | null;
  location: string | null;
  default_address: string | null;
  created_at: string;
  updated_at: string;
}

export interface CustomerProfileApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: CustomerProfile;
}
