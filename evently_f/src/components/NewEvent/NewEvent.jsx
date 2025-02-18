import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Stack,
  TextField,
} from "@mui/material";
import PropTypes from "prop-types";
import { useState } from "react";
import NewEventHandlers from "./NewEventHandlers";

const NewEvent = ({ open, onClose }) => {
  const [event, setEvent] = useState({});
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");

  const {
    handleInputChange,
    handleFileChange,
    handleRemoveImage,
    handleSubmit,
  } = NewEventHandlers(event, setEvent, setPreview, setError);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Criar um novo evento</DialogTitle>

      <DialogContent>
        <Stack direction={"row"} spacing={2}>
          <Stack width={"100%"}>
            <FormControl fullWidth>
              <TextField
                autoFocus
                margin="dense"
                label="Título do Evento"
                type="text"
                name="title"
                value={event.title}
                onChange={handleInputChange}
              />
            </FormControl>

            <FormControl fullWidth>
              <TextField
                autoFocus
                margin="dense"
                label="Capacidade do Evento"
                type="number"
                name="capacity"
                value={event.capacity}
                onChange={handleInputChange}
              />
            </FormControl>
          </Stack>

          <FormControl fullWidth>
            <TextField
              autoFocus
              margin="dense"
              label="Descrição do Evento"
              type="text"
              name="description"
              multiline
              minRows={4}
              value={event.description}
              onChange={handleInputChange}
            />
          </FormControl>
        </Stack>

        <Stack direction={"row"} spacing={2}>
          <FormControl fullWidth>
            <TextField
              margin="dense"
              label="Data do Evento"
              type="datetime-local"
              InputLabelProps={{
                shrink: true,
              }}
              name="dateEvent"
              value={event.dateEvent || ""}
              onChange={handleInputChange}
            />
          </FormControl>

          <FormControl fullWidth>
            <TextField
              margin="dense"
              label="Local do Evento"
              name="localEvent"
              value={event.localEvent}
              onChange={handleInputChange}
            />
          </FormControl>
        </Stack>

        <FormControl fullWidth>
          <Stack marginTop={2} spacing={2}>
            <Button variant="contained" component="label">
              Upload da Foto do Evento
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleFileChange}
              />
            </Button>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {preview && (
              <div style={{ position: "relative" }}>
                <img
                  src={preview}
                  alt="Preview"
                  style={{
                    marginTop: "10px",
                    maxHeight: "200px",
                    transition: "opacity 0.5s",
                    opacity: preview ? 1 : 0,
                  }}
                />
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleRemoveImage}
                  style={{ position: "absolute", top: "10px", right: "10px" }}
                >
                  Remover
                </Button>
              </div>
            )}
          </Stack>
        </FormControl>
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
