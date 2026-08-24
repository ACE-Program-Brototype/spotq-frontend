export type User = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type ApiUser = {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  status: string;
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

// Aliases for compatibility
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

export type RegisterResult = AuthResult;

export type VerifyOtpInput = {
  email: string;
  otp: string;
};


export type VerifyEmailResult = {
  success: boolean,
  statusCode: number,
  message: string
}

export type ResendOtpInput = {
  email: string
}