import type { Gender } from "../constants/profile.constants";

export type { Gender };

// Customer Profile Types
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

export interface ProfileHeroCardProps {
  profile: CustomerProfile;
}

export interface ProfileInfoCardsProps {
  profile: CustomerProfile;
}

export interface EditProfileFormProps {
  profile: CustomerProfile;
  onSubmit: (payload: UpdateCustomerProfileDto) => Promise<void> | void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export interface CustomerSidebarProps {
  profile?: CustomerProfile | null;
  className?: string;
}

// Staff Profile Types
export interface StaffProfileRawData {
  id?: string;
  restaurantId?: string;
  restaurant_id?: string;
  fullName?: string;
  fullname?: string;
  name?: string;
  email: string;
  phone?: string | null;
  phoneNumber?: string | null;
  avatar?: string | null;
  avatar_url?: string | null;
  role?: string;
  status?: string;
  createdAt?: string;
  created_at?: string;
}

export interface StaffProfileApiResponse {
  success: boolean;
  statusCode?: number;
  message: string;
  data: StaffProfileRawData;
}

export interface StaffProfile {
  id: string;
  restaurantId: string;
  fullName: string;
  email: string;
  phone: string | null;
  avatarUrl: string | null;
  role: string;
  status: string;
  createdAt: string | null;
}
