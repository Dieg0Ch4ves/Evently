import { Delete } from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EventService from "../../api/EventService";
import FormatDate from "../../utils/FormatDate";
import { truncateDescription } from "../../utils/truncateDescription";
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";

const BoxEvent = ({ event, userId, setSnackbarData }) => {
  const [openConfirm, setOpenConfirm] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  const navigate = useNavigate();
  const isUserEvent = event.createdBy === userId;

  const { formatDateTime } = FormatDate();
  const { handleDeleteEvent } = EventService();

  const handleDelete = async (id) => {
    try {
      await handleDeleteEvent(id);
      setIsDeleted(true);
      setSnackbarData({
        open: true,
        message: "Evento excluído com sucesso!",
        severity: "success",
      });
    } catch (error) {
      console.error("ERRO:", error);
      setSnackbarData({
        open: true,
        message: "Erro ao excluir evento!",
        severity: "error",
      });
    }
  };

  if (isDeleted) return null;

  return (
    <Paper
      elevation={5}
      sx={{
        maxWidth: 500,
        padding: 3,
        borderRadius: 3,
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "scale(1.02)",
        },
      }}
    >
      {/* Título */}
      <Typography
        variant="h5"
        fontWeight="bold"
        sx={{ wordWrap: "break-word", color: "#333" }}
      >
        {event.title}
      </Typography>

      {/* Imagem do evento */}
      <Box
        component="img"
        src={
          event.image
            ? `data:image/png;base64,${event.image}`
            : "https://prescotthobbies.com/wp-content/uploads/2019/12/image-not-available-684f2d57b8fb401a6846574ad4d7173be03aab64aac30c989eba8688ad9bfa05.png"
        }
        alt="Evento"
        sx={{
          width: "100%",
          height: 200,
          borderRadius: 2,
          objectFit: "cover",
          marginTop: 1,
          transition: "0.3s",
          "&:hover": {
            opacity: 0.9,
          },
        }}
      />

      {/* Descrição */}
      <Typography
        variant="body1"
        sx={{ mt: 2, color: "#555", wordWrap: "break-word" }}
      >
        {truncateDescription(event.description, 100)}
      </Typography>

      {/* Informações do evento */}
      <Stack direction="row" justifyContent="space-between" sx={{ mt: 2 }}>
        <Typography variant="body2" color="text.secondary">
          📅 <b>{event.dateEvent ? formatDateTime(event.dateEvent) : "N/A"}</b>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          👥 <b>{event.capacity} pessoas</b>
        </Typography>
      </Stack>

      {/* Botões de ação */}
      <Stack
        direction="row"
        spacing={2}
        justifyContent="space-between"
        alignItems="center"
        sx={{ mt: 3 }}
      >
        {/* Ações do criador do evento */}
        {isUserEvent ? (
          <>
            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                sx={{ textTransform: "none" }}
                onClick={() => navigate(`/event/${event.id}`)}
              >
                Ver Evento
              </Button>
            </Stack>

            <IconButton
              variant="outlined"
              color="error"
              aria-label="Excluir evento"
              onClick={() => setOpenConfirm(true)}
            >
              <Delete />
            </IconButton>

            {/* Diálogo de confirmação para exclusão */}
            <ConfirmDialog
              open={openConfirm}
              onClose={() => setOpenConfirm(false)}
              title="Confirmar Exclusão"
              content={`Tem certeza que deseja excluir o evento '${event.title}'? Esta ação não pode ser desfeita.`}
              onConfirm={() => handleDelete(event.id)}
            />
          </>
        ) : (
          <Button
            variant="contained"
            size="large"
            sx={{ textTransform: "none", width: "100%" }}
            onClick={() => navigate(`/event/${event.id}`)}
          >
            Ver Evento
          </Button>
        )}
      </Stack>
    </Paper>
  );
};

BoxEvent.propTypes = {
  event: PropTypes.object.isRequired,
  userId: PropTypes.string.isRequired,
  setSnackbarData: PropTypes.func.isRequired,
};

export default BoxEvent;
