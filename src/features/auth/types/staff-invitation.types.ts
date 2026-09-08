import type { User } from "./auth.types";

export type StaffInvitationStatus = "PENDING" | "ACCEPTED" | "EXPIRED" | "REVOKED";

export type StaffInvitationSortBy = "createdAt" | "expiresAt" | "email" | "status";
export type StaffInvitationSortOrder = "asc" | "desc";

export type StaffInvitation = {
  id: string;
  email: string;
  restaurantId: string;
  status: StaffInvitationStatus;
  expiresAt: string;
  createdAt: string;
};

export type SendStaffInvitationInput = {
  email: string;
};

export type ResendStaffInvitationInput = {
  email: string;
};

export type RevokeStaffInvitationInput = {
  invitationId?: string;
  email?: string;
};

export type ValidateInvitationResponse = {
  valid: boolean;
  email?: string;
  restaurantName?: string;
  message?: string;
};

export type AcceptInvitationInput = {
  token: string;
  fullname: string;
  phone: string;
  password: string;
};

export type AcceptInvitationResponse = {
  success: boolean;
  message: string;
  data?: {
    staff: User;
    accessToken: string;
  };
};

export type StaffMember = {
  id: string;
  employeeCode?: string;
  name: string;
  email: string;
  phone: string;
  designation: string;
  status: "ACTIVE" | "INACTIVE" | "PENDING";
  lastLogin: string;
  joinedDate: string;
  avatarUrl?: string;
};
