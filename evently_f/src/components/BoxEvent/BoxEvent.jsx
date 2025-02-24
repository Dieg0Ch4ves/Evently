import { Delete } from "@mui/icons-material";
import { Button, IconButton, Paper, Stack, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EventService from "../../api/EventService";
import FormatDate from "../../utils/FormatDate";
import { truncateDescription } from "../../utils/truncateDescription";
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";
import EditEvent from "../EditEvent/EditEvent";

const BoxEvent = ({ event, userId, setSnackbarData }) => {
  // ====================== STATE E VARIÁVEIS ====================== |

  const [openEdit, setOpenEdit] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  const navigate = useNavigate("");

  const isUserEvent = event.createdBy === userId;

  useEffect(() => {
    console.log(openConfirm);
  }, [openConfirm]);

  // ====================== ABSTRAÇÃO DOS MÉTODOS ====================== |

  const { formatDateTime } = FormatDate();
  const { handleDeleteEvent } = EventService();

  // ====================== MÉTODOS ====================== |

  const handleDelete = async (id) => {
    try {
      await handleDeleteEvent(id);
      setOpenConfirm(false);
      setIsDeleted(true);
      setSnackbarData({
        open: true,
        message: "Evento excluído com sucesso!",
        severity: "success",
      });
    } catch (error) {
      console.error(error);
      setSnackbarData({
        open: true,
        message: "Erro ao excluir evento!",
        severity: "error",
      });
    }
  };

  if (isDeleted) {
    return null;
  }

  return (
    <Stack component={Paper} elevation={3} width={500} spacing={2} padding={2}>
      <Typography variant="h4" style={{ wordWrap: "break-word" }}>
        {event.title}
      </Typography>
      <img
        style={{ width: "100%", height: "200px", borderRadius: "4px" }}
        src={
          event.image
            ? `data:image/png;base64,${event.image}`
            : "https://prescotthobbies.com/wp-content/uploads/2019/12/image-not-available-684f2d57b8fb401a6846574ad4d7173be03aab64aac30c989eba8688ad9bfa05.png"
        }
        alt="Evento"
      />

      <Stack>
        <Typography variant="body1" style={{ wordWrap: "break-word" }}>
          {truncateDescription(event.description, 100)}
        </Typography>
      </Stack>

      <Stack direction={"row"} justifyContent={"space-between"}>
        <Typography>
          Data do Evento:{" "}
          <span style={{ fontWeight: "bold" }}>
            {event.dateEvent ? formatDateTime(event.dateEvent) : "N/A"}
          </span>
        </Typography>
        <Typography>
          Capacidade:{" "}
          <span style={{ fontWeight: "bold" }}>{event.capacity}</span>
        </Typography>
      </Stack>

      {isUserEvent ? (
        <Stack spacing={2} direction={"row"} justifyContent={"space-between"}>
          <Stack direction={"row"} spacing={2}>
            <Button
              variant="contained"
              size="small"
              onClick={() => navigate(`/event/${event.id}`)}
            >
              Acessar
            </Button>
            <Button
              variant="contained"
              color="secondary"
              size="small"
              onClick={() => setOpenEdit(true)}
            >
              Editar
            </Button>
          </Stack>

          <IconButton
            variant="outlined"
            color="error"
            size="small"
            onClick={() => setOpenConfirm(true)}
          >
            <Delete />
          </IconButton>

          <ConfirmDialog
            open={openConfirm}
            onClose={() => setOpenConfirm(false)}
            title={"Confirmar Exclusão"}
            content={`Tem certeza que deseja excluir este evento de titulo '${event.title}'? Esta ação não pode ser desfeita.`}
            onConfirm={handleDelete}
            eventId={event.id}
          />

          <EditEvent
            open={openEdit}
            onClose={() => setOpenEdit(false)}
            eventId={event.id}
          />
        </Stack>
      ) : (
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate(`/event/${event.id}`)}
        >
          Acessar
        </Button>
      )}
    </Stack>
  );
};

BoxEvent.propTypes = {
  event: PropTypes.object.isRequired,
  userId: PropTypes.string.isRequired,
  setSnackbarData: PropTypes.func.isRequired,
};

export default BoxEvent;
