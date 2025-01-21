import axios from "axios";
import baseUrl from "../utils/baseUrl";

// Função para obter o token do localStorage
const getToken = () => localStorage.getItem("token");

// Instância configurada do Axios
const apiClient = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para adicionar o token ao header de cada requisição
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
