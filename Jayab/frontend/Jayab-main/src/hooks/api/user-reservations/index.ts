import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getAllUserReservations,
  getUserReservationById,
  postUserReservation,
  getVillaBookedDates,
} from "@/api/user-reservations";

export const useGetAllUserReservations = () => {
  return useQuery({
    queryKey: ["GetAllUserReservations"],
    queryFn: () => getAllUserReservations(),
  });
};

export const useGetUserReservationById = (reservation_id: number) => {
  return useQuery({
    queryKey: ["GetUserReservationById", reservation_id],
    queryFn: () => getUserReservationById(reservation_id),
    enabled: !!reservation_id, // Only run query if reservation_id exists
  });
};

export const usePostUserReservation = () => {
  return useMutation({
    mutationFn: (data: {
      villa_id: number;
      check_in_date: string;
      check_out_date: string;
      people_count: number;
    }) => postUserReservation(data),
  });
};

export const useGetVillaBookedDates = (villa_id: number) => {
  return useQuery({
    queryKey: ["GetVillaBookedDates", villa_id],
    queryFn: () => getVillaBookedDates(villa_id),
    enabled: !!villa_id, // Only run query if villa_id exists
  });
};
