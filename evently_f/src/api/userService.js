import apiClient from "./apiClient";

const userService = () => {
  // =================== FUNÇÃO PARA OBTER O USUARIO PELO ID =================== |

  async function handleGetUserById(id) {
    try {
      const response = await apiClient.get(`/auth/${id}`);

      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || "Erro ao buscar usuário");
    }
  }

  // =================== FUNÇÃO PARA OBTER TODOS OS USUARIOS =================== |

  async function handleGetAllUsers() {
    try {
      const response = await apiClient.get(`/auth/all`);

      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data || "Erro ao buscar todos os usuários"
      );
    }
  }

  // =================== FUNÇÃO PARA DELETAR USUARIO PELO ID =================== |

  async function handleDeleteUserById(id) {
    try {
      const response = await apiClient.delete(`/auth/${id}`);

      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || "Erro ao deletar usuário");
    }
  }

  // =================== FUNÇÃO PARA ATIVAR USUARIO PELO TOKEN =================== |

  async function handleActivateUserByToken(token) {
    try {
      const response = await apiClient.patch(`/auth/activate?token=${token}`);

      return response;
    } catch (error) {
      return error.response?.data || "Erro ao ativar usuário";
    }
  }

  async function handleForgotPassword(email) {
    try {
      const response = await apiClient.post(`/auth/forgot-password`, {
        email,
      });

      return response;
    } catch (error) {
      return error.response?.data || "Erro ao requisitar redefinição de senha";
    }
  }

  return {
    handleGetUserById,
    handleGetAllUsers,
    handleDeleteUserById,
    handleActivateUserByToken,
    handleForgotPassword,
  };
};

export default userService;
