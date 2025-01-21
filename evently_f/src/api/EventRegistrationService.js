import apiClient from "./apiClient";

const EventRegistrationService = () => {
  const handleSubscribeEvent = async (eventId, userId) => {
    try {
      const response = await apiClient.post(
        `registration/register/${eventId}/${userId}`
      );

      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || "Erro ao se inscrever no evento");
    }
  };
  const handleUnsubscribeEvent = async (registrationId) => {
    try {
      const response = await apiClient.post(
        `registration/unregister/${registrationId}`
      );

      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || "Erro ao se inscrever no evento");
    }
  };

  return { handleSubscribeEvent, handleUnsubscribeEvent };
};

export default EventRegistrationService;
