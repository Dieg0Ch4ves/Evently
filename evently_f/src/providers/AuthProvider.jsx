import axios from "axios";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import baseUrl from "../utils/baseUrl";
import AuthContext from "../contexts/AuthContext";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(storedUser);
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // Interceptor para capturar erros de token expirado
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 403) {
          logout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  const login = async (credentials) => {
    try {
      const response = await axios.post(`${baseUrl}/auth/login`, credentials, {
        headers: { "Content-Type": "application/json" },
      });

      const { token: authToken } = response.data;

      const userResponse = await axios.get(`${baseUrl}/auth/user`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      setUser(userResponse.data);
      setToken(authToken);
      localStorage.setItem("user", JSON.stringify(userResponse.data));
      localStorage.setItem("token", authToken);
      return response;
    } catch (error) {
      return error.response?.data || "Erro ao fazer login";
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const register = async (userData) => {
    try {
      const response = await axios.post(`${baseUrl}/auth/register`, userData, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status !== 201) {
        throw new Error("Erro ao realizar o cadastro.");
      }
    } catch (error) {
      console.log(error);
      throw new Error(error.response?.data || "Erro ao fazer cadastro");
    }
  };

  const refreshUser = async () => {
    try {
      const userResponse = await axios.get(`${baseUrl}/auth/user`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(userResponse.data);
      localStorage.setItem("user", JSON.stringify(userResponse.data));
    } catch (error) {
      logout(); // Se falhar, significa que o token pode estar inválido
      throw new Error(error.response?.data || "Erro ao fazer login");
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, logout, register, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
