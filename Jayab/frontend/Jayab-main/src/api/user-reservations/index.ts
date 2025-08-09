import api from "../interceptor";

const baseURL = "http://localhost:8003/reservations";

export const getAllUserReservations = async () => {
  try {
    const response = await api.get(`${baseURL}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching all user reservations:", error);
    throw error;
  }
};

export const getUserReservationById = async (reservation_id: number) => {
  try {
    const response = await api.get(`${baseURL}/${reservation_id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user reservation by ID:", error);
    throw error;
  }
};

export const postUserReservation = async (data: {
  villa_id: number;
  check_in_date: string;
  check_out_date: string;
  people_count: number;
}) => {
  try {
    const response = await api.post(`${baseURL}`, data);
    return response.data;
  } catch (error) {
    console.error("Error creating user reservation:", error);
    throw error;
  }
};

export const getVillaBookedDates = async (villa_id: number) => {
  try {
    const response = await api.get(`${baseURL}/villa/${villa_id}/dates`);
    return response.data;
  } catch (error) {
    console.error("Error fetching villa booked dates:", error);
    throw error;
  }
};
