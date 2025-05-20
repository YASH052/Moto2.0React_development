import axios from "axios";
import { APIConstant } from "../constant";



export const userId = localStorage.getItem("userId") || 1;
const Services = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  // timeout: 10000,
  headers: {
    Accept: "application/json",
  },
});

Services.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("authKey");
      // console.log("token", token);
      if (token) {
        console.log("config", config, "userId", userId)
        config.headers["authkey"] = token;
        config.url = config.url.replace(APIConstant.userId, userId);
      } else {
        // Redirect to login page if token is missing
        console.warn("Session expired. Redirecting to login...");
        localStorage.removeItem("authKey"); // Ensure auth key is cleared
        // window.location.href = "/login";
      }
      return config;
    },
    (error) => Promise.reject(error) // Return rejected promise for request errors
  );
export default Services;