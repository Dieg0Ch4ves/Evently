import apiClient from "./apiClient";

const EventService = () => {
  // ====================== GET DE TODOS OS EVENTOS ====================== |

  const handleGetAllEvents = async () => {
    try {
      const response = await apiClient.get("/event/all");

      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || "Erro ao localizar eventos");
    }
  };

  // ====================== GET DE EVENTO POR ID ====================== |

  const handleGetEventById = async (id) => {
    try {
      const response = await apiClient.get(`/event/${id}`);

      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || "Erro ao localizar evento");
    }
  };

  // ====================== GET DE EVENTO POR ID DE USUARIO ====================== |

  const handleGetEventByIdUser = async (id) => {
    try {
      const response = await apiClient.get(`/event/get-by-user/${id}`);

      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || "Erro ao localizar eventos");
    }
  };

  // ====================== POST DE EVENTO ====================== |

  const handlePostEvent = async (userId, event) => {
    try {
      const response = await apiClient.post(`/event/${userId}`, event);

      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || "Erro ao localizar evento");
    }
  };

  // ====================== POST DE EVENTO ====================== |

  const handlePutEvent = async (userId, event) => {
    try {
      const response = await apiClient.put(`/event/${userId}`, event);

      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || "Erro ao localizar evento");
    }
  };

  return {
    handleGetAllEvents,
    handleGetEventByIdUser,
    handleGetEventById,
    handlePostEvent,
    handlePutEvent,
  };
};

export default EventService;
