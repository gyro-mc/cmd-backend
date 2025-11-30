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
    // Log request details
    console.group(
      `🚀 HTTP Request: ${config.method?.toUpperCase()} ${config.url}`
    );
    console.log("Base URL:", config.baseURL);
    console.log("Full URL:", `${config.baseURL}${config.url}`);
    console.log("Headers:", config.headers);
    if (config.data) {
      console.log("Request Body:", config.data);
    }
    if (config.params) {
      console.log("Query Params:", config.params);
    }
    console.groupEnd();

    // Add auth token if available
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Extract data from the standardized response format
    const apiResponse = response.data as ApiSuccessResponse | ApiErrorResponse;

    console.group(
      `✅ HTTP Response: ${response.config.method?.toUpperCase()} ${
        response.config.url
      }`
    );
    console.log("Status:", response.status);
    console.log("Raw Response:", apiResponse);

    if (apiResponse.success) {
      console.log("Unwrapped Data:", apiResponse.data);
      console.groupEnd();

      // Return the actual data for successful responses
      response.data = apiResponse.data;
      return response;
    } else {
      console.error("Error Response:", apiResponse.error);
      console.groupEnd();

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
    console.group(
      `❌ HTTP Error: ${error.config?.method?.toUpperCase()} ${
        error.config?.url
      }`
    );
    console.log("Status:", error.response?.status);
    console.log("Status Text:", error.response?.statusText);
    console.log("Error Response:", error.response?.data);

    // Handle network errors or non-standard responses
    if (error.response?.status === 401) {
      console.log("🔒 Unauthorized - Redirecting to login");
      console.groupEnd();

      // Redirect to login or refresh token
      localStorage.removeItem("auth_token");
      window.location.href = "/login";
    }

    // If the error response has our standard format, extract the error
    if (error.response?.data?.error) {
      const extractedError = {
        message: error.response.data.error.message,
        type: error.response.data.error.type,
        details: error.response.data.error.details,
        hint: error.response.data.error.hint,
        status: error.response.status,
      };
      console.log("Extracted Error:", extractedError);
      console.groupEnd();

      return Promise.reject(extractedError);
    }

    console.log("Raw Error:", error);
    console.groupEnd();

    return Promise.reject(error);
  }
);

export default axiosInstance;
