export type Role = "ADMIN" | "CUSTOMER" | "RESTAURANT_ADMIN" | "RESTAURANT_STAFF";

export type User = {
  id?: string;
  _id?: string;
  fullName?: string;
  name?: string;
  email: string;
  role?: Role;
  phone?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  created_at?: string;
};

export type ApiUser = {
  id?: string;
  _id?: string;
  full_name?: string;
  name?: string;
  email: string;
  role?: Role;
  phone?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
};

export type DeviceInput = {
  deviceName?: string;
  platform?: "ANDROID" | "IOS" | "WEB";
  fcmToken?: string;
};

export type LoginInput = {
  email: string;
  password?: string;
  device?: DeviceInput;
};

export type ApiAuthResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    user: ApiUser;
    access_token: string;
    refresh_token?: string;
  };
};

export type AuthResult = {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    user: User;
    accessToken: string;
  };
};

export type LoginResult = AuthResult;
export type GoogleLoginResult = AuthResult;

export type LogoutResult = {
  success: boolean;
  statusCode: number;
  message: string;
};

export type RegisterInput = {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
};

export type RegisterResult = {
  success: boolean;
  statusCode?: number;
  message: string;
};

export type VerifyOtpInput = {
  email: string;
  otp: string;
};

export type VerifyEmailResult = AuthResult;

export type ResendOtpInput = {
  email: string;
};

export type EmailVerificationProps = {
  onCodeSent?: (email: string) => void;
  requestOtp?: (email: string) => Promise<void>;
};

export type VerifyOtpSuccessDashboard = {
  nextStep: "DASHBOARD";
  accessToken: string;
};

export type VerifyOtpSuccessOnboarding = {
  nextStep: "ONBOARDING";
  verificationToken: string;
};

export type VerifyOtpResponse = VerifyOtpSuccessDashboard | VerifyOtpSuccessOnboarding;

export type ApiErrorShape = {
  code?: string;
  message?: string;
};

export type OtpVerificationProps = {
  email?: string;
  onGoToDashboard?: () => void;
  onGoToOnboarding?: (verificationToken: string) => void;
  onBack?: () => void;
  verifyOtp?: (email: string, otp: string) => Promise<VerifyOtpResponse>;
  resendOtp?: (email: string) => Promise<void>;
};

export type StaffLoginInput = {
  email: string;
  password: string;
};

export type StaffLoginResponse = {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
  };
};

export type StaffLogoutRes = {
  success: boolean;
  message: string;
};
