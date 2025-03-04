import { Add } from "@mui/icons-material";
import { Masonry } from "@mui/lab";
import {
  Alert,
  Button,
  Divider,
  Grid,
  Paper,
  Snackbar,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import EventService from "../api/EventService";
import BoxEvent from "../components/BoxEvent/BoxEvent";
import NewEvent from "../components/NewEvent/NewEvent";
import { useAuth } from "../contexts/AuthContext";

const Dashboard = () => {
  const [eventRegistrations, setEventRegistrations] = useState([]);
  const [eventsCreated, setEventsCreated] = useState([]);
  const [openNewEvent, setOpenNewEvent] = useState(false);
  const [snackbarData, setSnackbarData] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
        console.log(eventsCreatedResponse);
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

  const handleCloseSnackbar = () => {
    setSnackbarData((prev) => ({ ...prev, open: false }));
  };

  const addEventToList = (event) => {
    setEventsCreated((prev) => [...prev, event]);
  };

  return (
    <Stack spacing={2} margin={5}>
      <Stack>
        <Button onClick={open} variant="outlined" color="success">
          <Add />
          <Typography>Criar Evento</Typography>
        </Button>
        <NewEvent
          open={openNewEvent}
          onClose={close}
          setSnackbarData={setSnackbarData}
          addEventToList={addEventToList}
        />
      </Stack>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Stack spacing={2}>
            <Stack component={Paper} padding={2} elevation={6}>
              <Typography variant="h5" fontWeight={"bold"}>
                Eventos Inscritos
              </Typography>
            </Stack>
            <Divider />
            {eventRegistrations?.length !== 0 ? (
              <Masonry columns={isMobile ? 1 : 2} spacing={2}>
                {eventRegistrations.map((event, index) => (
                  <BoxEvent key={index} event={event} userId={user.id} />
                ))}
              </Masonry>
            ) : (
              <Typography variant="caption">
                Você não se inscreveu em nenhum evento ainda!
              </Typography>
            )}
          </Stack>
        </Grid>

        <Grid item xs={12} md={6}>
          <Stack spacing={2}>
            <Stack component={Paper} padding={2} elevation={6}>
              <Typography variant="h5" fontWeight={"bold"}>
                Eventos Criados
              </Typography>
            </Stack>
            <Divider />
            {eventsCreated?.length !== 0 ? (
              <Masonry columns={isMobile ? 1 : 2} spacing={2}>
                {eventsCreated.map((event, index) => (
                  <BoxEvent
                    key={index}
                    event={event}
                    userId={user.id}
                    setSnackbarData={setSnackbarData}
                  />
                ))}
              </Masonry>
            ) : (
              <Typography variant="caption">
                Você não possui nenhum evento ainda!
              </Typography>
            )}
          </Stack>
        </Grid>
      </Grid>

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

export default Dashboard;
