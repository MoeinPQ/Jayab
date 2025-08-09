import { useMutation } from "@tanstack/react-query";
import { login, loginVerify } from "@/api/login";

export const useLogin = () => {
  return useMutation({
    mutationFn: login,
  });
};

export const useVerifyLogin = () => {
  return useMutation({
    mutationFn: loginVerify,
  });
};
