// utils/axiosInstance.js
import { env } from "@/env";
import axios from "axios";

export const CODE = "PDF2CSV2024";

const axiosInstance = axios.create({
  baseURL: env.API_URL,
  timeout: 300000, // 5 minutes timeout
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    config.headers.Authorization = `Bearer ${CODE}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
