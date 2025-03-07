import apiClient from "./apiClient";

const userService = () => {
  async function handleGetUserById(id) {
    try {
      const response = await apiClient.get(`/auth/${id}`);

      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || "Erro ao buscar usuário");
    }
  }

  return { handleGetUserById };
};

export default userService;
