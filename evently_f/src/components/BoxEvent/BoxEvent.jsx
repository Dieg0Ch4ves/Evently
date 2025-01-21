import { Button, Paper, Stack, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const BoxEvent = ({ event }) => {
  const navigate = useNavigate("");

  console.log(event);

  return (
    <Stack component={Paper} elevation={3} width={500} spacing={2} padding={2}>
      <Typography variant="h4">{event.title}</Typography>
      <img
        style={{ width: "100%", height: "200px", borderRadius: "4px" }}
        src={
          event.image
            ? event.image
            : "https://prescotthobbies.com/wp-content/uploads/2019/12/image-not-available-684f2d57b8fb401a6846574ad4d7173be03aab64aac30c989eba8688ad9bfa05.png"
        }
        alt=""
      />

      <Typography variant="subtitle1">{event.description}</Typography>

      <Stack direction={"row"} justifyContent={"space-between"}>
        <Typography>
          Data do Evento:{" "}
          <span style={{ fontWeight: "bold" }}>{event.dateEvent}</span>
        </Typography>
        <Typography>
          Capacidade:{" "}
          <span style={{ fontWeight: "bold" }}>{event.capacity}</span>
        </Typography>
      </Stack>

      <Button
        variant="contained"
        size="large"
        onClick={() => navigate(`/event/${event.id}`)}
      >
        Acessar
      </Button>
    </Stack>
  );
};

BoxEvent.propTypes = {
  event: PropTypes.object.isRequired,
};

export default BoxEvent;
