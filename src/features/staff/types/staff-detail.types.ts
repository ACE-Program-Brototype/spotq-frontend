/**
 * Staff Detail Domain & API Types
 */

export interface StaffDetailRawData {
  id: string;
  restaurantId?: string;
  restaurant_id?: string;
  fullname?: string;
  fullName?: string;
  email: string;
  phone?: string | null;
  phoneNumber?: string | null;
  avatarUrl?: string | null;
  avatar_url?: string | null;
  role: string;
  status: string;
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
}

export interface StaffDetailApiResponse {
  success: boolean;
  statusCode?: number;
  message: string;
  data: StaffDetailRawData;
}

export type StaffStatus = "ACTIVE" | "INACTIVE";

export interface StaffDetail {
  id: string;
  restaurantId: string;
  fullName: string;
  email: string;
  phone: string | null;
  avatarUrl: string | null;
  role: string;
  status: StaffStatus | (string & {});
  createdAt: string | null;
  updatedAt: string | null;
}

export interface UpdateStaffStatusPayload {
  status: StaffStatus;
}

export interface UpdateStaffInfoPayload {
  fullname: string;
  phone: string;
}

export interface StaffDetailHeaderProps {
  staff: StaffDetail;
  onEditStaff?: () => void;
  onToggleStatus?: () => void;
  onRequestDelete?: () => void;
  isUpdatingStatus?: boolean;
  isDeleting?: boolean;
}

export interface EditStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: StaffDetail;
}

export interface StaffEditFormProps {
  staff: StaffDetail;
  onSuccess?: (updatedStaff?: StaffDetail) => void;
  onCancel?: () => void;
}

export interface StaffDetailCardsProps {
  staff: StaffDetail;
}

export interface StaffDetailErrorStateProps {
  title?: string;
  message?: string;
  isNotFound?: boolean;
  isForbidden?: boolean;
  onRetry?: () => void;
}
