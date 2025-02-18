import { Button, Stack, Typography } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import EventService from "../api/EventService";
import { Masonry } from "@mui/lab";
import BoxEvent from "../components/BoxEvent/BoxEvent";
import NewEvent from "../components/NewEvent/NewEvent";

const Dashboard = () => {
  const [eventRegistrations, setEventRegistrations] = useState([]);
  const [eventsCreated, setEventsCreated] = useState([]);
  const [openNewEvent, setOpenNewEvent] = useState(false);

  const { user } = useAuth();

  const { handleGetEventById, handleGetEventByIdUser } = EventService();

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.registrations) return;

      try {
        const registrations = await Promise.all(
          user.registrations.map(async (registration) => {
            const event = await handleGetEventById(registration.eventId);
            return event;
          })
        );

        const eventsCreatedResponse = await handleGetEventByIdUser(user.id);

        setEventsCreated(eventsCreatedResponse);
        setEventRegistrations(registrations);
      } catch (error) {
        console.error("Erro ao buscar eventos:", error);
      }
    };

    fetchData();
  }, [user]);

  const open = () => {
    setOpenNewEvent(true);
  };

  const close = () => {
    setOpenNewEvent(false);
  };

  return (
    <Stack spacing={2} margin={5}>
      <Stack>
        <Button onClick={open} variant="contained">
          Criar Evento
        </Button>
        <NewEvent open={openNewEvent} onClose={close} />
      </Stack>

      <Stack direction={"row"} justifyContent={"space-between"}>
        <Stack width={"100%"} spacing={2}>
          <Typography variant="h5">Eventos Inscritos</Typography>

          {eventRegistrations?.length != 0 ? (
            <Masonry columns={2} spacing={2}>
              {eventRegistrations.map((event, index) => {
                return <BoxEvent key={index} event={event} />;
              })}
            </Masonry>
          ) : (
            <Typography variant="caption">
              Você não se inscreveu em nenhum evento ainda!
            </Typography>
          )}
        </Stack>

        <Stack spacing={2} width={"100%"}>
          <Typography variant="h5">Eventos Criados</Typography>

          {eventsCreated?.length != 0 ? (
            <Masonry columns={2} spacing={2}>
              {eventsCreated.map((event, index) => {
                return <BoxEvent key={index} event={event} />;
              })}
            </Masonry>
          ) : (
            <Typography variant="caption">
              Você não possui nenhum evento ainda!
            </Typography>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Dashboard;
