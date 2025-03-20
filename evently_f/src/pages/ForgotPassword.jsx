import { ArrowBack, Email } from "@mui/icons-material";
import {
  Button,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import userService from "../api/userService";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "success",
  });

  const { handleForgotPassword } = userService();

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async () => {
    if (validateEmail(email)) {
      setError("");
      setLoading(true);
      const response = await handleForgotPassword(email);
      setLoading(false);

      if (response.status === 200) {
        setSnackbar({
          open: true,
          message: "E-mail enviado com sucesso!",
          type: "success",
        });
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setSnackbar({
          open: true,
          message: response.message || "Erro ao enviar e-mail",
          type: "error",
        });
      }
    } else {
      setError("Por favor, insira um e-mail válido.");
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Stack alignItems={"center"} minHeight={"90vh"} justifyContent={"center"}>
      <Stack elevation={4} spacing={5} padding={6} component={Paper}>
        <IconButton
          onClick={() => navigate(-1)}
          size="large"
          sx={{ alignSelf: "start" }}
        >
          <ArrowBack sx={{ fontSize: "2rem" }} />
        </IconButton>

        <Typography variant="h4" fontWeight={700}>
          Informe seu e-mail para troca de senha!
        </Typography>

        <TextField
          label="E-mail"
          name="email"
          value={email}
          onChange={handleChange}
          error={!!error}
          helperText={error}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Email />
              </InputAdornment>
            ),
          }}
        />

        <Button
          size="large"
          sx={{ alignSelf: "center" }}
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Enviar"}
        </Button>
      </Stack>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.type}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Stack>
  );
};

export default ForgotPassword;
