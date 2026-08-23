import { useMutation } from "@tanstack/react-query";
import { authService } from "../services/auth.service";
import type {
  GoogleLoginResult,
  LoginInput,
  LoginResult,
  LogoutResult,
  RegisterInput,
  RegisterResult,
} from "../types/auth.types";

export const useLoginMutation = () => {
  return useMutation<LoginResult, Error, LoginInput>({
    mutationFn: (input) => authService.login(input),
  });
};

export const useGoogleLoginMutation = () => {
  return useMutation<GoogleLoginResult, Error, { idToken: string }>({
    mutationFn: (input) => authService.googleLogin(input),
  });
};

export const useLogoutMutation = () => {
  return useMutation<LogoutResult, Error, void>({
    mutationFn: () => authService.logout(),
  });
};

export const useRegisterMutation = () => {
  return useMutation<RegisterResult, Error, RegisterInput>({
    mutationFn: (input) => authService.register(input),
  });
};
