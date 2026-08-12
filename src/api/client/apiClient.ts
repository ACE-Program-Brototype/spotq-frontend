import axios from "axios";
import { API_CONFIG } from "@/api/config/apiConfig";

const apiClient = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: {
    "Content-Type": API_CONFIG.contentType,
  },
});

export default apiClient;
