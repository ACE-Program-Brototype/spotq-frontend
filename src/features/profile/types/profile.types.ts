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
