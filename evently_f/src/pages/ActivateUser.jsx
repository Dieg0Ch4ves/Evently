import {
  Button,
  Paper,
  Snackbar,
  Stack,
  Typography,
  Alert,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import userService from "../api/userService";

const ActivateUser = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token"); // Obtém o token da query string

  const navigate = useNavigate();
  const { handleActivateUserByToken } = userService();

  const [snackbarData, setSnackbarData] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseSnackbar = () => {
    setSnackbarData({ ...snackbarData, open: false });
  };

  const handleActivate = async () => {
    if (token == null || token === "" || token === undefined) {
      setSnackbarData({
        open: true,
        message: "Token inválido",
        severity: "error",
      });
      navigate("/");
      return;
    }

    const response = await handleActivateUserByToken(token);

    console.log(response);
    if (response.status === 200) {
      setSnackbarData({
        open: true,
        message: "Conta ativada com sucesso!",
        severity: "success",
      });
      setTimeout(() => {
        navigate("/login");
      }, 3000); // Redireciona para a página de login após 3 segundos
    } else {
      setSnackbarData({
        open: true,
        message: "Falha ao ativar a conta",
        severity: "error",
      });
    }
  };

  return (
    <Stack
      component={Paper}
      alignItems={"center"}
      justifySelf={"center"}
      marginTop={4}
      spacing={2}
      padding={2}
    >
      <Typography variant="h4" gutterBottom>
        Ativar Conta
      </Typography>
      <Typography variant="body1" gutterBottom>
        Clique no botão abaixo para ativar sua conta.
      </Typography>
      <Button variant="contained" color="primary" onClick={handleActivate}>
        Ativar Conta
      </Button>
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
  );
};

export default ActivateUser;
