import apiClient from "./apiClient";

const EventRegistrationService = () => {
  // ============================ FUNCTION SUBSCRIBE EVENT ============================ |

  const handleSubscribeEvent = async (eventId, userId) => {
    try {
      const response = await apiClient.post(
        `registration/register/${eventId}/${userId}`
      );

      return response.data;
    } catch (error) {
      throw new Error(error || "Erro ao se inscrever no evento");
    }
  };

  // ============================ FUNCTION UNSUBSCRIBE EVENT ============================ |

  const handleUnsubscribeEvent = async (eventId, userId) => {
    try {
      const response = await apiClient.delete(
        `registration/unregister/${eventId}/${userId}`
      );

      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || "Erro ao se inscrever no evento");
    }
  };

  return { handleSubscribeEvent, handleUnsubscribeEvent };
};

export default EventRegistrationService;
