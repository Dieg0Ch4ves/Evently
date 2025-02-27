import { ArrowBack, Delete } from "@mui/icons-material";
import {
  Alert,
  Button,
  Divider,
  IconButton,
  Paper,
  Skeleton,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EventRegistrationService from "../api/EventRegistrationService";
import EventService from "../api/EventService";
import ConfirmDialog from "../components/ConfirmDialog/ConfirmDialog";
import EditEvent from "../components/EditEvent/EditEvent";
import { useAuth } from "../contexts/AuthContext";
import FormatDate from "../utils/FormatDate";

const Event = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [openEdit, setOpenEdit] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [snackbarData, setSnackbarData] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const { handleGetEventById, handleDeleteEvent, handlePutEvent } =
    EventService();
  const { formatDateTime } = FormatDate();
  const { handleSubscribeEvent, handleUnsubscribeEvent } =
    EventRegistrationService();

  useEffect(() => {
    const fetchData = async () => {
      try {
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

  const handleSubscribe = async () => {
    try {
      await handleSubscribeEvent(event.id, user.id);
      await refreshUser();
      setEvent({
        ...event,
        registrations: [...event.registrations, { userId: user.id }],
      });
      setSnackbarData({
        open: true,
        message: "Inscrição realizada com sucesso!",
        severity: "success",
      });
    } catch (error) {
      console.error("Erro ao se inscrever no evento:", error);
      setSnackbarData({
        open: true,
        message: "Erro ao se inscrever no evento.",
        severity: "error",
      });
    }
  };

  // TODO: Implemente a função handleUnsubscribe, pois está passando o parametro errado para requisição

  const handleUnsubscribe = async () => {
    try {
      await handleUnsubscribeEvent(event.id, user.id);
      await refreshUser();
      setEvent({
        ...event,
        registrations: event.registrations.filter(
          (registration) => registration.userId !== user.id
        ),
      });
      setSnackbarData({
        open: true,
        message: "Inscrição cancelada com sucesso!",
        severity: "info",
      });
    } catch (error) {
      console.error("Erro ao cancelar inscrição:", error);
      setSnackbarData({
        open: true,
        message: "Erro ao cancelar inscrição.",
        severity: "error",
      });
    }
  };

  const handleDelete = async () => {
    try {
      await handleDeleteEvent(event.id);
      setSnackbarData({
        open: true,
        message: "Evento excluído com sucesso!",
        severity: "success",
      });
      navigate("/"); // Redireciona após exclusão
    } catch (error) {
      console.error("Erro ao excluir evento:", error);
      setSnackbarData({
        open: true,
        message: "Erro ao excluir evento.",
        severity: "error",
      });
    }
  };

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

  const handleCloseSnackbar = () => {
    setSnackbarData((prev) => ({ ...prev, open: false }));
  };

  const isUserRegistered = event?.registrations?.some(
    (registration) => registration.userId === user.id
  );

  const isCreatedByUser = event?.createdBy === user.id;

  const availableSeats = event?.capacity - (event?.registrations?.length || 0);

  return (
    <Stack
      component={Paper}
      elevation={5}
      maxWidth={800}
      margin={"auto"}
      p={3}
      mt={4}
      borderRadius={3}
      boxShadow={3}
    >
      <IconButton
        onClick={() => navigate("/")}
        sx={{
          alignSelf: "start",
          transition: "0.3s",
          "&:hover": { transform: "scale(1.1)", color: "primary.main" },
        }}
        size="large"
      >
        <ArrowBack fontSize="large" />
      </IconButton>

      {isLoading ? (
        <Skeleton variant="rectangular" height={500} sx={{ borderRadius: 2 }} />
      ) : (
        <>
          <Stack width="100%">
            <img
              src={
                event.image
                  ? `data:image/png;base64,${event.image}`
                  : "https://prescotthobbies.com/wp-content/uploads/2019/12/image-not-available-684f2d57b8fb401a6846574ad4d7173be03aab64aac30c989eba8688ad9bfa05.png"
              }
              alt="Imagem do Evento"
              style={{
                width: "100%",
                borderRadius: 8,
                objectFit: "cover",
                maxHeight: 450,
              }}
            />
          </Stack>

          <Typography
            variant="h3"
            fontWeight={600}
            mt={2}
            sx={{ wordBreak: "break-word" }}
          >
            {event.title}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="body1" sx={{ wordBreak: "break-word" }}>
            <strong>Descrição:</strong> {event.description}
          </Typography>

          <Stack direction="row" justifyContent="space-between" mt={2}>
            <Typography variant="body1">
              <strong>Data:</strong>{" "}
              {event.dateEvent ? formatDateTime(event.dateEvent) : "N/A"}
            </Typography>
            <Typography variant="body1">
              <strong>Capacidade:</strong> {event.capacity}
            </Typography>
          </Stack>

          <Typography variant="body1" mt={1}>
            <strong>Local:</strong> {event.localEvent}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="body1">
              <strong>Vagas disponíveis:</strong> {availableSeats}/
              {event.capacity}
            </Typography>

            {isCreatedByUser ? (
              <Stack direction="row" spacing={2}>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => setOpenEdit(true)}
                >
                  Editar
                </Button>
                <IconButton
                  color="error"
                  size="small"
                  onClick={() => setOpenConfirm(true)}
                >
                  <Delete />
                </IconButton>
                <ConfirmDialog
                  open={openConfirm}
                  onClose={() => setOpenConfirm(false)}
                  title="Confirmar Exclusão"
                  content={`Deseja realmente excluir o evento '${event.title}'?`}
                  onConfirm={handleDelete}
                />
                <EditEvent
                  open={openEdit}
                  onClose={() => setOpenEdit(false)}
                  handleEdit={handleEdit}
                  event={event}
                  setEvent={setEvent}
                />
              </Stack>
            ) : isUserRegistered ? (
              <Button
                variant="outlined"
                color="error"
                onClick={handleUnsubscribe}
              >
                Cancelar Inscrição
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubscribe}
                disabled={availableSeats <= 0}
              >
                Inscrever-se
              </Button>
            )}
          </Stack>
        </>
      )}

      <Snackbar
        open={snackbarData.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarData.severity}>
          {snackbarData.message}
        </Alert>
      </Snackbar>
    </Stack>
  );
};

export default Event;
