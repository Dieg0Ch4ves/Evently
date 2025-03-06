import { useCallback, useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EventService from "../api/EventService";
import EventRegistrationService from "../api/EventRegistrationService";
import { useAuth } from "./useAuth";

const useEvent = () => {
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

  // ✅ Memoizando os serviços para evitar re-renderizações desnecessárias
  const eventService = useMemo(() => EventService(), []);
  const eventRegistrationService = useMemo(
    () => EventRegistrationService(),
    []
  );

  // ✅ Memoizando as funções para evitar re-criação em cada render
  const fetchEvent = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await eventService.handleGetEventById(id);
      setEvent(response);
    } catch (error) {
      console.error("Erro ao carregar evento:", error);
    } finally {
      setIsLoading(false);
    }
  }, [id, eventService]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  const handleSubscribe = useCallback(async () => {
    try {
      await eventRegistrationService.handleSubscribeEvent(event.id, user.id);
      await refreshUser();
      setEvent((prev) => ({
        ...prev,
        registrations: [...(prev?.registrations || []), { userId: user.id }],
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
  }, [event, user.id, eventRegistrationService, refreshUser]);

  const handleUnsubscribe = useCallback(async () => {
    try {
      const userRegistration = event?.registrations?.find(
        (r) => r.userId === user.id
      );
      if (!userRegistration) return;

      await eventRegistrationService.handleUnsubscribeEvent(event.id, user.id);
      await refreshUser();

      setEvent((prev) => ({
        ...prev,
        registrations:
          prev?.registrations?.filter((r) => r.userId !== user.id) || [],
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
  }, [event, user.id, eventRegistrationService, refreshUser]);

  const handleEdit = useCallback(async () => {
    try {
      const updatedEvent = await eventService.handlePutEvent(event.id, event);
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
  }, [event, eventService]);

  const handleDelete = useCallback(async () => {
    try {
      await eventService.handleDeleteEvent(event.id);
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
  }, [event, eventService, navigate]);

  const handleCloseSnackbar = useCallback(() => {
    setSnackbarData((prev) => ({ ...prev, open: false }));
  }, []);

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
