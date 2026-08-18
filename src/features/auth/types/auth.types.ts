export type User = {
  id: string;
  fullname: string;
  email: string;
  phone: string;
  status: string;
  createdAt: string;
  updatedAt: string;
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

export type LoginResult = {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
};

export type GoogleLoginResult = {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    user: {
      id: string;
      full_name: string;
      email: string;
      status: string;
    };
    access_token: string;
  };
};
