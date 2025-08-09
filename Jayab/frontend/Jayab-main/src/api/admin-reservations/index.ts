import api from "../interceptor";

const baseURL = "http://localhost:8003/reservations/admin";

export const getAllReservations = async () => {
  try {
    const response = await api.get(`${baseURL}/all`);
    return response.data;
  } catch (error) {
    console.error("Error fetching all reservations:", error);
    throw error;
  }
};

export const getAllReservationsByUserId = async (userId: number) => {
  try {
    const response = await api.get(`${baseURL}/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching all reservations for user:", error);
    throw error;
  }
};

export const deleteReservationByReserveId = async (reserveId: number) => {
  try {
    const response = await api.delete(`${baseURL}/${reserveId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting reservation:", error);
    throw error;
  }
};
