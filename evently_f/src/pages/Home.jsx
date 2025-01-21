import Masonry from "@mui/lab/Masonry";
import { Backdrop, CircularProgress, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import EventService from "../api/EventService";
import BoxEvent from "../components/BoxEvent/BoxEvent";

const Home = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { handleGetAllEvents } = EventService();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await handleGetAllEvents();
        setEvents(response);
        setIsLoading(false);
      } catch (error) {
        console.error("Erro ao buscar eventos:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Stack padding={4}>
      {isLoading ? (
        <Backdrop open={isLoading} style={{ zIndex: 1 }}>
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : (
        <>
          <Typography variant="h2">Lista de Eventos</Typography>
          {events.length !== 0 ? (
            <Masonry columns={3} spacing={4}>
              {events.map((event, index) => {
                return <BoxEvent key={index} event={event} />;
              })}
            </Masonry>
          ) : (
            <Typography variant="caption">
              No momento não há eventos disponíveis!
            </Typography>
          )}
        </>
      )}
    </Stack>
  );
};

export default Home;
