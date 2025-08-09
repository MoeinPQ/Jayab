import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getAllReservations,
  getAllReservationsByUserId,
  deleteReservationByReserveId,
} from "@/api/admin-reservations";

export const useGetAllReservations = () => {
  return useQuery({
    queryKey: ["GetAllReservations"],
    queryFn: () => getAllReservations(),
  });
};

export const useGetAllReservationsByUserId = (userId: number) => {
  return useQuery({
    queryKey: ["GetAllReservationsByUserId", userId],
    queryFn: () => getAllReservationsByUserId(userId),
    enabled: !!userId, // Only run query if userId exists
  });
};

export const useDeleteReservationByReserveId = () => {
  return useMutation({
    mutationFn: (reserveId: number) => deleteReservationByReserveId(reserveId),
  });
};
