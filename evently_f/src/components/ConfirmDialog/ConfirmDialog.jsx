import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import PropTypes from "prop-types";

const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  content,
  eventId,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {content}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancelar
        </Button>
        <Button onClick={() => onConfirm(eventId)} color="error" autoFocus>
          Excluir
        </Button>
      </DialogActions>
    </Dialog>
  );
};
ConfirmDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  eventId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default ConfirmDialog;
