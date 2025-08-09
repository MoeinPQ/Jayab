import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8001",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    console.log(token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized access - Redirecting to login...");
    } else {
      console.error("An error occurred:", error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
