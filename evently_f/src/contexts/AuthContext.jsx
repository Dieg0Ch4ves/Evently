import axios from "axios";
import PropTypes from "prop-types";
import { createContext, useState, useContext, useEffect } from "react";
import baseUrl from "../utils/baseUrl";

// Criação do contexto
const AuthContext = createContext();

// Provider para gerenciar estado global
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Armazena informações do usuário
  const [token, setToken] = useState(null); // Armazena o token JWT ou similar
  const [loading, setLoading] = useState(true); // Para inicialização

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(storedUser);
      setToken(storedToken);
    }
    setLoading(false);
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
    } catch (error) {
      throw new Error(error.response?.data || "Erro ao fazer login");
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

// Hook para usar o AuthContext
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
