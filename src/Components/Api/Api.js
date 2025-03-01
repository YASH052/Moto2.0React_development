import axios from "axios";
import SecureStorage from "react-secure-storage";

// Base URL from environment variables
const baseURL = import.meta.env.VITE_BASE_URL;

// Retrieve user ID with a fallback to 1
const userId = SecureStorage.getItem("userId") || 1;

// Create Axios instance with default configurations
const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});
// alert("hit")
// Add Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = SecureStorage.getItem("authKey");

    if (token) {
      config.headers["authKey"] = token;
    } else {
      // Redirect to login page if token is missing
      console.warn("Session expired. Redirecting to login...");
      SecureStorage.removeItem("authKey"); // Ensure auth key is cleared
      window.location.href = "/login";
    }
    return config;
  },
  (error) => Promise.reject(error) // Return rejected promise for request errors
);

// Add Response Interceptor
api.interceptors.response.use(
  (response) => {
    if (response.data.statusCode == 401 || response.status == 401) {
      alert("Unauthorized. Redirecting to login...");
      SecureStorage.removeItem("authKey");
      window.location.href = "/login";
    }
    return response; // Ensure the response is returned
  },
  (error) => {
    const { response } = error;

    if (response) {
      if (response.status == 401) {
        alert("Unauthorized. Redirecting to login...");
        SecureStorage.removeItem("authKey");
        window.location.href = "/login";
      } else {
        console.error(`Error: ${response.status} - ${response.statusText}`);
      }
    } else {
      console.error("Network Error: Unable to connect to the server.");
    }
    return Promise.reject(error); // Ensure errors are propagated
  }
);

    
// Login API

