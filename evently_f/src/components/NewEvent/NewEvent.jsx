import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import PropTypes from "prop-types";
import { useState } from "react";
import EventService from "../../api/EventService";
import { useAuth } from "../../contexts/AuthContext";
import FormEvent from "../FormEvent/FormEvent";

const NewEvent = ({ open, onClose }) => {
  const [event, setEvent] = useState({});
  const { user } = useAuth();
  const { handlePostEvent } = EventService();

  const handleSubmit = async () => {
    try {
      const response = await handlePostEvent(user.id, event);
      console.log(response);
    } catch (error) {
      console.error("ERRO: ", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Criar um novo evento</DialogTitle>

      <DialogContent>
        <FormEvent event={event} setEvent={setEvent} />
      </DialogContent>

      <DialogActions>
        <Button color="error" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="contained" onClick={handleSubmit} color="primary">
          Criar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

NewEvent.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default NewEvent;
