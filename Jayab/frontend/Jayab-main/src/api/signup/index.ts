import api from "../interceptor";

export const signup = async (userData: {
  first_name: string;
  last_name: string;
  national_code: string;
  phone_number: string;
  password: string;
}) => {
  try {
    const response = await api.post("/auth/signup", userData);

    return response.data;
  } catch (error) {
    console.error("Error during signup:", error);
    throw error;
  }
};

type VerificationData = {
  request: {
    phone_number: string;
    otp: string;
  };
  signup_data: {
    first_name: string;
    last_name: string;
    national_code: string;
    phone_number: string;
    password: string;
  };
};

export const verifySignup = async (verificationData: VerificationData) => {
  try {
    const response = await api.post("/auth/signup/verify", verificationData);

    return response.data;
  } catch (error) {
    console.error("Error during signup verification:", error);
    throw error;
  }
};
