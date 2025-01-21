import { useState } from "react";
import {
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Paper,
  Stack,
  TextField,
  Typography,
  FormHelperText,
  Snackbar,
  Alert,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "success",
  });

  const { login } = useAuth();

  const navigate = useNavigate("");

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    let tempErrors = {};
    if (!formData.email) {
      tempErrors.email = "E-mail é obrigatório.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Insira um e-mail válido.";
    }

    if (!formData.password) {
      tempErrors.password = "Senha é obrigatória.";
    } else if (formData.password.length < 6) {
      tempErrors.password = "A senha deve ter pelo menos 6 caracteres.";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        await login(formData);
        setSnackbar({
          open: true,
          message: "Login realizado com sucesso!",
          type: "success",
        });
        navigate("/");
      } catch (error) {
        setSnackbar({
          open: true,
          message: error.message || "Erro ao realizar login.",
          type: "error",
        });
      }
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: "", type: "success" });
  };

  return (
    <Stack
      component={Paper}
      elevation={5}
      padding={4}
      spacing={3}
      marginTop={10}
      justifySelf={"center"}
    >
      <IconButton
        onClick={() => navigate("/")}
        size="large"
        sx={{ alignSelf: "start" }}
      >
        <ArrowBack sx={{ fontSize: "2rem" }} />
      </IconButton>

      <Typography variant="h5" align="center">
        Entre no Evently
      </Typography>

      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <FormControl fullWidth error={!!errors.email}>
            <TextField
              label="E-mail"
              placeholder="Digite seu e-mail"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
            />
            {errors.email && <FormHelperText>{errors.email}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth error={!!errors.password}>
            <OutlinedInput
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Digite sua senha"
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label={
                      showPassword ? "Ocultar senha" : "Mostrar senha"
                    }
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
            {errors.password && (
              <FormHelperText>{errors.password}</FormHelperText>
            )}
          </FormControl>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Entrar
          </Button>
        </Stack>
      </form>

      <Stack alignItems={"center"} spacing={2}>
        <a href="">Esqueci minha senha!</a>
        <Typography>
          Não possui cadastro? Clique <a href="/register">aqui!</a>{" "}
        </Typography>
      </Stack>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.type}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Stack>
  );
};

export default Login;
