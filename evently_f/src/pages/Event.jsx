import {
  Backdrop,
  Button,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import EventService from "../api/EventService";
import { useAuth } from "../contexts/AuthContext";
import FormatDate from "../utils/FormatDate";
import EventRegistrationService from "../api/EventRegistrationService";

const Event = () => {
  const { id } = useParams();
  const [event, setEvent] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { user, refreshUser } = useAuth();

  const { handleGetEventById } = EventService();
  const { formatDateTime } = FormatDate();
  const { handleSubscribeEvent } = EventRegistrationService();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await handleGetEventById(id);
        setEvent(response);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSubscribe = async () => {
    try {
      const response = await handleSubscribeEvent(event.id, user.id);
      await refreshUser();
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Stack component={Paper} elevation={5} padding={2} margin={4} spacing={2}>
      {isLoading ? (
        <Backdrop open={isLoading} style={{ zIndex: 1 }}>
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : (
        <>
          <Stack height={"70%"}>
            <img
              style={{
                width: "100%",
                borderRadius: "4px",
                overflow: "hidden",
                height: "500px",
              }}
              src={
                event.image
                  ? event.image
                  : "https://prescotthobbies.com/wp-content/uploads/2019/12/image-not-available-684f2d57b8fb401a6846574ad4d7173be03aab64aac30c989eba8688ad9bfa05.png"
              }
              alt=""
            />
          </Stack>
          <Typography variant="h2">{event.title}</Typography>
          <Typography variant="body1">{event.description}</Typography>

          <Stack>
            <Typography variant="body1">
              <span style={{ fontWeight: "bold" }}>Data do Evento:</span>{" "}
              {event.dateEvent}
            </Typography>
            <Typography variant="body1">
              <span style={{ fontWeight: "bold" }}>Capacidade:</span>{" "}
              {event.capacity}
            </Typography>
            <Typography variant="body1">
              <span style={{ fontWeight: "bold" }}>Local do Evento:</span>{" "}
              {event.localEvent}
            </Typography>
          </Stack>

          <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Typography variant="body1">
              <span style={{ fontWeight: "bold" }}>Vagas disponíveis:</span>{" "}
              {event?.registrations?.length}/{event.capacity}
            </Typography>

            <Button onClick={handleSubscribe} size="large" variant="contained">
              Inscrever
            </Button>
          </Stack>

          <Typography textAlign={"end"} variant="caption">
            Criado Em:{" "}
            {event.createdDate ? formatDateTime(event.createdDate) : "N/A"}
          </Typography>
        </>
      )}
    </Stack>
  );
};

export default Event;
