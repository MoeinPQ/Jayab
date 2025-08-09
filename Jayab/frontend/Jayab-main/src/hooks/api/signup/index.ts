import { useMutation } from "@tanstack/react-query";
import { signup, verifySignup } from "@/api/signup";

export const useSignUp = () => {
  return useMutation({
    mutationFn: signup,
  });
};

export const useVerifySignup = () => {
  return useMutation({
    mutationFn: verifySignup,
  });
};
