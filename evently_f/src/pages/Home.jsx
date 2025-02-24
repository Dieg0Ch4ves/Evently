import Masonry from "@mui/lab/Masonry";
import {
  Alert,
  Backdrop,
  CircularProgress,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import EventService from "../api/EventService";
import BoxEvent from "../components/BoxEvent/BoxEvent";
import { useAuth } from "../contexts/AuthContext";

const Home = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbarData, setSnackbarData] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const { user } = useAuth();
  const { handleGetAllEvents } = EventService();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await handleGetAllEvents();
        setEvents(response);
      } catch (error) {
        console.error("Erro ao buscar eventos:", error);
        setSnackbarData({
          open: true,
          message: "Erro ao carregar eventos!",
          severity: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCloseSnackbar = () => {
    setSnackbarData((prev) => ({ ...prev, open: false }));
  };

  return (
    <Stack padding={4}>
      {isLoading ? (
        <Backdrop open={isLoading} style={{ zIndex: 1 }}>
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : (
        <Stack spacing={2} alignItems={"center"} justifyContent={"center"}>
          <Typography variant="h2">Lista de Eventos</Typography>
          {events.length !== 0 ? (
            <Masonry columns={3} spacing={4}>
              {events.map((event, index) => (
                <BoxEvent
                  key={index}
                  event={event}
                  userId={user?.id}
                  setSnackbarData={setSnackbarData}
                />
              ))}
            </Masonry>
          ) : (
            <Typography variant="caption">
              No momento não há eventos disponíveis!
            </Typography>
          )}
        </Stack>
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

export default Home;
