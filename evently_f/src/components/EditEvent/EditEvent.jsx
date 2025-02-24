import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import PropTypes from "prop-types";
import FormEvent from "../FormEvent/FormEvent";
import EventService from "../../api/EventService";
import { useEffect, useState } from "react";

const EditEvent = ({ open, onClose, eventId }) => {
  const [event, setEvent] = useState({});

  const { handleGetEventById, handlePutEvent } = EventService();

  useEffect(() => {
    const fetchData = async () => {
      if (!eventId) return;
      try {
        const response = await handleGetEventById(eventId);

        setEvent(response);
      } catch (error) {
        console.error("Erro ao buscar evento:", error);
      }
    };

    fetchData();
  }, [eventId]);

  const handleSubmit = async () => {
    try {
      const response = await handlePutEvent(event.id, event);
      console.log(response);
    } catch (error) {
      console.error("ERRO: ", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Editar evento</DialogTitle>

      <DialogContent>
        <FormEvent
          event={event}
          setEvent={setEvent}
          previewOpt={
            event.image ? `data:image/png;base64,${event.image}` : null
          }
        />
      </DialogContent>

      <DialogActions>
        <Button color="error" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="contained" onClick={handleSubmit} color="primary">
          Editar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
EditEvent.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  eventId: PropTypes.number.isRequired,
};

export default EditEvent;
