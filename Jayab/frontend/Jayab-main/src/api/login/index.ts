import api from "../interceptor";

export const login = async (userData: { phone_number: string }) => {
  try {
    const response = await api.post("/auth/login", userData);

    return response.data;
  } catch (error) {
    console.error("Error during signup:", error);
    throw error;
  }
};

export const loginVerify = async (userData: {
  phone_number: string;
  otp: string;
}) => {
  try {
    const response = await api.post("/auth/login/verify", userData);

    return response.data;
  } catch (error) {
    console.error("Error during signup:", error);
    throw error;
  }
};
