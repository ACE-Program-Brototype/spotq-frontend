import { useMutation } from "@tanstack/react-query";
import { authService } from "../services/auth.service";
import type { GoogleLoginResult, LoginInput, LoginResult } from "../types/auth.types";

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
