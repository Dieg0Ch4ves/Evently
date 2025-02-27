import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import PropTypes from "prop-types";
import FormEvent from "../FormEvent/FormEvent";

const EditEvent = ({ open, onClose, handleEdit, event, setEvent }) => {
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
        <Button variant="contained" onClick={handleEdit} color="primary">
          Editar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
EditEvent.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired,
  event: PropTypes.object.isRequired,
  setEvent: PropTypes.func.isRequired,
};

export default EditEvent;
