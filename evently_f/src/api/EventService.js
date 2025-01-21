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

  // ====================== POST DE EVENTO ====================== |

  const handlePostEvent = async (userId, event) => {
    try {
      const response = await apiClient.post(`/event/${userId}`, event);

      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || "Erro ao localizar evento");
    }
  };

  return { handleGetAllEvents, handleGetEventById, handlePostEvent };
};

export default EventService;
