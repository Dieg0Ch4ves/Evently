import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EventService from "../api/EventService";
import EventRegistrationService from "../api/EventRegistrationService";
import { useAuth } from "../contexts/AuthContext";

const useEvent = () => {
  // =================== VÁRIAVEIS E STATES ===================

  const { id } = useParams();
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [openEdit, setOpenEdit] = useState(false);
  const [snackbarData, setSnackbarData] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // =================== ABSTRAINDO MÉTODOS ===================

  const { handleGetEventById, handleDeleteEvent, handlePutEvent } =
    EventService();

  const { handleSubscribeEvent, handleUnsubscribeEvent } =
    EventRegistrationService();

  // =================== BUSCA OS DADOS DO EVENTO PELO ID ===================

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await handleGetEventById(id);
        setEvent(response);
      } catch (error) {
        console.error("Erro ao carregar evento:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // =================== LIDA COM A INSCRIÇÃO NO EVENTO ===================

  const handleSubscribe = async () => {
    try {
      await handleSubscribeEvent(event.id, user.id);
      await refreshUser();
      setEvent((prev) => ({
        ...prev,
        registrations: [...prev.registrations, { userId: user.id }],
      }));
      setSnackbarData({
        open: true,
        message: "Inscrição realizada!",
        severity: "success",
      });
    } catch (error) {
      console.error("Erro ao se inscrever:", error);
      setSnackbarData({
        open: true,
        message: "Erro ao se inscrever.",
        severity: "error",
      });
    }
  };

  // =================== LIDA COM O CANCELAMENTO DA INSCRIÇÃO NO EVENTO ===================

  const handleUnsubscribe = async () => {
    try {
      const userRegistration = event.registrations.find(
        (r) => r.userId === user.id
      );
      if (!userRegistration) return;

      await handleUnsubscribeEvent(event.id, user.id);
      await refreshUser();

      setEvent((prev) => ({
        ...prev,
        registrations: prev.registrations.filter(
          (r) => r.id !== userRegistration.id
        ),
      }));

      setSnackbarData({
        open: true,
        message: "Inscrição cancelada!",
        severity: "info",
      });
    } catch (error) {
      console.error("Erro ao cancelar:", error);
      setSnackbarData({
        open: true,
        message: "Erro ao cancelar inscrição.",
        severity: "error",
      });
    }
  };

  // =================== LIDA COM A EDIÇÃO DO EVENTO ===================

  const handleEdit = async () => {
    try {
      const updatedEvent = await handlePutEvent(event.id, event);
      setEvent(updatedEvent);
      setSnackbarData({
        open: true,
        message: "Evento atualizado com sucesso!",
        severity: "success",
      });
      setOpenEdit(false);
    } catch (error) {
      console.error("Erro ao editar evento:", error);
      setOpenEdit(false);
      setSnackbarData({
        open: true,
        message: "Erro ao editar evento.",
        severity: "error",
      });
    }
  };

  // =================== LIDA COM A EXCLUSÃO DO EVENTO ===================

  const handleDelete = async () => {
    try {
      await handleDeleteEvent(event.id);
      setSnackbarData({
        open: true,
        message: "Evento excluído!",
        severity: "success",
      });
      navigate("/");
    } catch (error) {
      console.error("Erro ao excluir:", error);
      setSnackbarData({
        open: true,
        message: "Erro ao excluir evento.",
        severity: "error",
      });
    }
  };

  // =================== LIDA COM O FECHAMENTO DO SNACKBAR ===================

  const handleCloseSnackbar = () => {
    setSnackbarData((prev) => ({ ...prev, open: false }));
  };

  return {
    event,
    setEvent,
    isLoading,
    snackbarData,
    openEdit,
    setOpenEdit,
    setSnackbarData,
    handleSubscribe,
    handleUnsubscribe,
    handleEdit,
    handleDelete,
    isUserRegistered: event?.registrations?.some((r) => r.userId === user.id),
    isCreatedByUser: event?.createdBy === user.id,
    availableSeats: event?.capacity - (event?.registrations?.length || 0),
    handleCloseSnackbar,
  };
};

export default useEvent;
