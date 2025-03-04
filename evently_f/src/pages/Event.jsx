import { ArrowBack, Delete } from "@mui/icons-material";
import {
  Alert,
  Backdrop,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  Paper,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmDialog from "../components/ConfirmDialog/ConfirmDialog";
import EditEvent from "../components/EditEvent/EditEvent";
import useEvent from "../hooks/useEvent";
import FormatDate from "../utils/FormatDate";

const Event = () => {
  const navigate = useNavigate();
  const [openConfirm, setOpenConfirm] = useState(false);

  const { formatDateTime } = FormatDate();

  const {
    event,
    setEvent,
    isLoading,
    snackbarData,
    openEdit,
    setOpenEdit,
    handleSubscribe,
    handleUnsubscribe,
    handleEdit,
    handleDelete,
    isUserRegistered,
    isCreatedByUser,
    availableSeats,
    handleCloseSnackbar,
  } = useEvent();

  if (isLoading) {
    return (
      <Backdrop open={isLoading} style={{ zIndex: 1 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

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

      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="body1">
          <strong>Vagas disponíveis:</strong> {availableSeats}/{event.capacity}
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
          <Button variant="outlined" color="error" onClick={handleUnsubscribe}>
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
