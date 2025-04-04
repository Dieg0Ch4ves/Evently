import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "./useAuth";
import eventService from "@/api/eventService";
import eventRegistrationService from "../api/eventRegistrationService";
import userService from "../api/userService";

const useEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const [event, setEvent] = useState(null);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openEdit, setOpenEdit] = useState(false);
  const [snackbarData, setSnackbarData] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // ✅ Memoizando os serviços para evitar re-renderizações desnecessárias
  const eventServiceMemo = useMemo(() => eventService(), []);
  const eventRegistrationServiceMemo = useMemo(
    () => eventRegistrationService(),
    []
  );
  const userServiceMemo = useMemo(() => userService(), []);

  // ✅ Memoizando as funções para evitar re-criação em cada render
  const fetchEvent = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await eventServiceMemo.handleGetEventById(id);
      setEvent(response);
    } catch (error) {
      console.error("Erro ao carregar evento:", error);
    } finally {
      setIsLoading(false);
    }
  }, [id, eventServiceMemo]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  useEffect(() => {
    const fetchUsers = async () => {
      const users = await Promise.all(
        event.registrations.map(async (registration) => {
          const response = await userServiceMemo.handleGetUserById(
            registration.userId
          );
          return response;
        })
      );
      console.log(users);
      setUsers(users);
    };

    fetchUsers();
  }, [event, userServiceMemo]);

  const handleSubscribe = useCallback(async () => {
    try {
      await eventRegistrationServiceMemo.handleSubscribeEvent(
        event.id,
        user.id
      );
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
  }, [event, user.id, eventRegistrationServiceMemo, refreshUser]);

  const handleUnsubscribe = useCallback(async () => {
    try {
      const userRegistration = event?.registrations?.find(
        (r) => r.userId === user.id
      );
      if (!userRegistration) return;

      await eventRegistrationServiceMemo.handleUnsubscribeEvent(
        event.id,
        user.id
      );
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
  }, [event, user.id, eventRegistrationServiceMemo, refreshUser]);

  const handleRemoveSubscribe = useCallback(
    async (eventId, userId) => {
      try {
        await eventRegistrationServiceMemo.handleUnsubscribeEvent(
          eventId,
          userId
        );
        await refreshUser();

        setUsers((prev) => prev.filter((u) => u.id !== userId));

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
    },
    [eventRegistrationServiceMemo, refreshUser]
  );

  const handleEdit = useCallback(async () => {
    try {
      const updatedEvent = await eventServiceMemo.handlePutEvent(
        event.id,
        event
      );
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
  }, [event, eventServiceMemo]);

  const handleDelete = useCallback(async () => {
    try {
      await eventServiceMemo.handleDeleteEvent(event.id);
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
  }, [event, eventServiceMemo, navigate]);

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
    handleRemoveSubscribe,
    handleEdit,
    handleDelete,
    isUserRegistered: event?.registrations?.some((r) => r.userId === user.id),
    isCreatedByUser: event?.createdBy === user.id,
    availableSeats: event?.capacity - (event?.registrations?.length || 0),
    handleCloseSnackbar,
    users,
  };
};

export default useEvent;
