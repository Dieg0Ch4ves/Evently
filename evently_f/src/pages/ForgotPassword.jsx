import { ArrowBack, Email } from "@mui/icons-material";
import {
  Button,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import userService from "../api/userService";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

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
      const response = await handleForgotPassword(email);
      console.log("E-mail válido:", response);
    } else {
      setError("Por favor, insira um e-mail válido.");
    }
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
        >
          Enviar
        </Button>
      </Stack>
    </Stack>
  );
};

export default ForgotPassword;
