import { Group, Search } from "@mui/icons-material";
import Masonry from "@mui/lab/Masonry";
import {
  Alert,
  Backdrop,
  CircularProgress,
  Fade,
  InputAdornment,
  MenuItem,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import eventService from "../api/eventService";
import BoxEvent from "../components/BoxEvent/BoxEvent";
import { useAuth } from "../hooks/useAuth";

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

  const eventServiceMemo = useMemo(() => eventService(), []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await eventServiceMemo.handleGetAllEvents();
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
  }, [eventServiceMemo]);

  const handleCloseSnackbar = () => {
    setSnackbarData((prev) => ({ ...prev, open: false }));
  };

  const filteredEvents = events.filter((event) => {
    const eventDate = new Date(event.dateEvent);
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
    <Fade in={true} timeout={500}>
      <Stack padding={{ sm: 2, md: 1 }} spacing={3} alignItems="center">
        <Stack
          component={Paper}
          alignItems={"center"}
          padding={2}
          spacing={4}
          width="100%"
        >
          <Typography variant="h2" textAlign="center" gutterBottom>
            Bem-vindo ao Evently{user && ", " + user?.name}!
          </Typography>
          <Typography variant="body1" textAlign="center" maxWidth="400px">
            Explore e participe de eventos incríveis! Utilize os filtros para
            buscar eventos por título, data ou capacidade mínima. Conecte-se com
            a comunidade e aproveite as melhores oportunidades.
          </Typography>
        </Stack>

        <Stack
          direction={{ md: "row", sm: "column" }}
          spacing={{ md: 2, sm: 4, xs: 2 }}
          width={"100%"}
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
            sx={{ minWidth: "200px" }}
          />
          <TextField
            label="Capacidade mínima"
            select
            value={filterCapacity}
            onChange={(e) => setFilterCapacity(e.target.value)}
            sx={{ minWidth: "400px" }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Group />
                </InputAdornment>
              ),
            }}
          >
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="10">10+</MenuItem>
            <MenuItem value="50">50+</MenuItem>
            <MenuItem value="100">100+</MenuItem>
          </TextField>
        </Stack>

        {isLoading ? (
          <Backdrop open={isLoading} style={{ zIndex: 1 }}>
            <CircularProgress color="inherit" />
          </Backdrop>
        ) : filteredEvents.length !== 0 ? (
          filteredEvents.length === 1 ? (
            // Renderização especial para apenas 1 evento
            <Stack alignItems="center" spacing={2}>
              <BoxEvent
                event={filteredEvents[0]}
                userId={user?.id}
                setSnackbarData={setSnackbarData}
              />
            </Stack>
          ) : (
            // Renderização normal com Masonry para múltiplos eventos
            <Stack alignContent={"center"}>
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
            </Stack>
          )
        ) : (
          <Typography variant="subtitle1" color="textSecondary">
            No momento, não há eventos disponíveis. Volte em breve!
          </Typography>
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
    </Fade>
  );
};

export default Home;
