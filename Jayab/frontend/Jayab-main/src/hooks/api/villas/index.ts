import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getVillas,
  getVillaById,
  postVillas,
  updateVillas,
  deleteVillas,
} from "@/api/villas";

export const useGetVillas = (params?: {
  city?: string;
  min_capacity?: string;
  max_price?: string;
}) => {
  return useQuery({
    queryKey: ["GetVillas", params],
    queryFn: () => getVillas(params),
  });
};

export const useGetVillaById = (id: number) => {
  return useQuery({
    queryKey: ["GetVillaById", id],
    queryFn: () => getVillaById(id),
    enabled: !!id, // Only run query if id exists
  });
};

export const usePostVillas = () => {
  return useMutation({
    mutationFn: (data: any) => postVillas(data),
  });
};

export const useUpdateVillas = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      updateVillas(id, data),
  });
};

export const useDeleteVillas = () => {
  return useMutation({
    mutationFn: (id: number) => deleteVillas(id),
  });
};
