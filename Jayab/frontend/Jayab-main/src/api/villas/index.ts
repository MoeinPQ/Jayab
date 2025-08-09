import api from "../interceptor";

const baseURL = "http://localhost:8002";

export const postVillas = async (data: any) => {
  try {
    const response = await api.post(`${baseURL}/villas`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching villas:", error);
    throw error;
  }
};

export const getVillas = async (params?: {
  city?: string;
  min_capacity?: string;
  max_price?: string;
}) => {
  try {
    const queryParams = new URLSearchParams();

    if (params?.city) {
      queryParams.append("city", params.city);
    }
    if (params?.min_capacity) {
      queryParams.append("min_capacity", params.min_capacity);
    }
    if (params?.max_price) {
      queryParams.append("max_price", params.max_price);
    }

    const queryString = queryParams.toString();
    const url = queryString
      ? `${baseURL}/villas?${queryString}`
      : `${baseURL}/villas`;

    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching villas:", error);
    throw error;
  }
};

export const updateVillas = async (id: number, data: any) => {
  try {
    const response = await api.put(`${baseURL}/villas/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating villa:", error);
    throw error;
  }
};

export const deleteVillas = async (id: number) => {
  try {
    const response = await api.delete(`${baseURL}/villas/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting villa:", error);
    throw error;
  }
};

export const getVillaById = async (id: number) => {
  try {
    const response = await api.get(`${baseURL}/villas/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching villa by ID:", error);
    throw error;
  }
};
