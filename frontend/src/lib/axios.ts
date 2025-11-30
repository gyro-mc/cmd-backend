import axios from "axios";
import type { ApiSuccessResponse, ApiErrorResponse } from "../types";

/**
 * Axios instance configured to handle standardized API responses.
 *
 * The backend returns all responses in this format:
 * Success: { success: true, status: 200, data: {...}, error: null }
 * Error: { success: false, status: 400, data: null, error: {...} }
 *
 * The response interceptor automatically unwraps successful responses,
 * so API functions receive the actual data directly (response.data).
 */
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Extract data from the standardized response format
    const apiResponse = response.data as ApiSuccessResponse | ApiErrorResponse;

    if (apiResponse.success) {
      // Return the actual data for successful responses
      response.data = apiResponse.data;
      return response;
    } else {
      // Treat success: false as an error
      return Promise.reject({
        response: {
          status: apiResponse.status,
          data: apiResponse.error,
        },
      });
    }
  },
  (error) => {
    // Handle network errors or non-standard responses
    if (error.response?.status === 401) {
      // Redirect to login or refresh token
      localStorage.removeItem("auth_token");
      window.location.href = "/login";
    }

    // If the error response has our standard format, extract the error
    if (error.response?.data?.error) {
      return Promise.reject({
        message: error.response.data.error.message,
        type: error.response.data.error.type,
        details: error.response.data.error.details,
        hint: error.response.data.error.hint,
        status: error.response.status,
      });
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
