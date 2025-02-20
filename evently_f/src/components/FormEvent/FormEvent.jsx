import { Button, FormControl, Stack, TextField } from "@mui/material";
import { useState } from "react";
import PropTypes from "prop-types";
import FormEventHandlers from "./FormEventHandler";

const FormEvent = ({ event, setEvent, previewOpt }) => {
  const [preview, setPreview] = useState(previewOpt || null);
  const [error, setError] = useState("");

  const { handleInputChange, handleFileChange, handleRemoveImage } =
    FormEventHandlers(event, setEvent, setPreview, setError);

  return (
    <Stack>
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
    </Stack>
  );
};
FormEvent.propTypes = {
  event: PropTypes.object.isRequired,
  setEvent: PropTypes.func.isRequired,
  previewOpt: PropTypes.string,
};

export default FormEvent;
