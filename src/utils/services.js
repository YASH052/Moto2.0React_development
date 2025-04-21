import axios from "axios";
import { baseUrl } from "../Components/Common/urls";
const token = localStorage.getItem("authKey");

const Services = axios.create({
  baseURL: baseUrl,
  // timeout: 10000,
  headers: {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  },
});

export default Services;