import axios from "axios";
import { API_CONFIG } from "../config/apiConfig";


const apiClient = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;