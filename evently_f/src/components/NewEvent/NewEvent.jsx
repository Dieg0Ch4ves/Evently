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
import FormEvent from "../FormEvent/FormEvent";
import { useAuth } from "../../hooks/useAuth";

const NewEvent = ({ open, onClose, setSnackbarData, addEventToList }) => {
  const [event, setEvent] = useState({});
  const { user } = useAuth();
  const { handlePostEvent } = EventService();

  const handleSubmit = async () => {
    try {
      const response = await handlePostEvent(user.id, event);
      console.log(response);
      setSnackbarData({
        open: true,
        message: "Evento criado com sucesso!",
        severity: "success",
      });
      addEventToList(response); // Adiciona o novo evento à lista de eventos
      setEvent({}); // Reinicia o estado do evento
      onClose();
    } catch (error) {
      console.error("ERRO: ", error);
      setSnackbarData({
        open: true,
        message: "Erro ao criar evento!",
        severity: "error",
      });
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
  setSnackbarData: PropTypes.func.isRequired,
  addEventToList: PropTypes.func.isRequired,
};

export default NewEvent;
