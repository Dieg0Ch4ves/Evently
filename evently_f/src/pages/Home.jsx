import Masonry from "@mui/lab/Masonry";
import {
  Alert,
  Backdrop,
  CircularProgress,
  MenuItem,
  Snackbar,
  Stack,
  TextField,
  Typography,
  Box,
  InputAdornment,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import EventService from "../api/EventService";
import BoxEvent from "../components/BoxEvent/BoxEvent";
import { useAuth } from "../hooks/useAuth";
import { Search } from "@mui/icons-material";

const Home = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterCapacity, setFilterCapacity] = useState("");
  const [snackbarData, setSnackbarData] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const { user } = useAuth();

  const eventService = useMemo(() => EventService(), []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await eventService.handleGetAllEvents();
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
  }, [eventService]);

  const handleCloseSnackbar = () => {
    setSnackbarData((prev) => ({ ...prev, open: false }));
  };

  const filteredEvents = events.filter((event) => {
    const eventDate = new Date(event.dateEvent);
    // Ajusta para o horário local
    const localDate = new Date(
      eventDate.getTime() - eventDate.getTimezoneOffset() * 60000
    );
    const eventDateString = localDate.toISOString().split("T")[0];

    return (
      event.title.toLowerCase().includes(search.toLowerCase()) &&
      (filterDate ? eventDateString === filterDate : true) &&
      (filterCapacity ? event.capacity >= parseInt(filterCapacity) : true)
    );
  });

  return (
    <Stack padding={4} spacing={3}>
      {isLoading ? (
        <Backdrop open={isLoading} style={{ zIndex: 1 }}>
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : (
        <Stack spacing={3} alignItems="center" justifyContent="center">
          <Typography variant="h2" textAlign="center">
            Lista de Eventos
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              width: "100%",
              maxWidth: "800px",
              alignItems: "center",
            }}
          >
            <TextField
              label="Buscar por título"
              variant="outlined"
              fullWidth
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Filtrar por Data"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              sx={{ minWidth: "150px" }}
            />
            <TextField
              label="Capacidade mínima"
              select
              value={filterCapacity}
              onChange={(e) => setFilterCapacity(e.target.value)}
              sx={{ minWidth: "150px" }}
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="10">10+</MenuItem>
              <MenuItem value="50">50+</MenuItem>
              <MenuItem value="100">100+</MenuItem>
            </TextField>
          </Box>

          {filteredEvents.length !== 0 ? (
            <Masonry columns={{ xs: 1, sm: 2, md: 3 }} spacing={4}>
              {filteredEvents.map((event, index) => (
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
