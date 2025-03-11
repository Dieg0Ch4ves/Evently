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

  async function handleDeleteUserById(id) {
    try {
      const response = await apiClient.delete(`/auth/${id}`);

      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || "Erro ao deletar usuário");
    }
  }

  return { handleGetUserById, handleGetAllUsers, handleDeleteUserById };
};

export default userService;
