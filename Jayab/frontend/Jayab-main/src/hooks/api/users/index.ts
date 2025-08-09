import { useQuery } from "@tanstack/react-query";
import { getUserById, getUsersProfile } from "@/api/users";

export const useGetUserById = (userId: number, enabled: boolean = false) => {
  return useQuery({
    queryKey: ["GetUserById", userId],
    queryFn: () => getUserById(userId),
    enabled: enabled ? true : false,
  });
};

export const useGetUsersProfile = (enabled: boolean = false) => {
  return useQuery({
    queryKey: ["GetUsersProfile"],
    queryFn: () => getUsersProfile(),
    enabled: enabled ? true : false,
  });
};
