import { Delete } from "@mui/icons-material";
import { Button, IconButton, Paper, Stack, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import FormatDate from "../../utils/FormatDate";
import EditEvent from "../EditEvent/EditEvent";
import { useState } from "react";

const BoxEvent = ({ event, userId }) => {
  const [openEdit, setOpenEdit] = useState(false);

  const navigate = useNavigate("");

  const { formatDateTime } = FormatDate();
  const isUserEvent = event.createdBy === userId;

  const truncateDescription = (description, limit) => {
    if (description.length > limit) {
      return description.substring(0, limit) + "...";
    }
    return description;
  };

  return (
    <Stack component={Paper} elevation={3} width={500} spacing={2} padding={2}>
      <Typography variant="h4">{event.title}</Typography>
      <img
        style={{ width: "100%", height: "200px", borderRadius: "4px" }}
        src={
          event.image
            ? `data:image/png;base64,${event.image}`
            : "https://prescotthobbies.com/wp-content/uploads/2019/12/image-not-available-684f2d57b8fb401a6846574ad4d7173be03aab64aac30c989eba8688ad9bfa05.png"
        }
        alt=""
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
            onClick={() => navigate(`/event/${event.id}`)}
          >
            <Delete />
          </IconButton>
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

      <EditEvent
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        eventId={event.id}
      />
    </Stack>
  );
};

BoxEvent.propTypes = {
  event: PropTypes.object.isRequired,
  userId: PropTypes.string.isRequired,
};

export default BoxEvent;
