import { ArrowBack, Person } from "@mui/icons-material";
import LoginIcon from "@mui/icons-material/Login"; // Ícone para botão
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  Alert,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

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
      const response = await login(formData);

      console.log(response);

      if (response?.status !== 200) {
        setSnackbar({
          open: true,
          message: response?.message || "Erro ao realizar login.",
          type: "error",
        });
        return;
      }

      setSnackbar({
        open: true,
        message: "Login realizado com sucesso!",
        type: "success",
      });
      navigate("/");
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: "", type: "success" });
  };

  return (
    <Stack
      component={Paper}
      elevation={5}
      padding={5}
      spacing={3}
      margin="auto"
      maxWidth={400}
      mt={8}
      borderRadius={3}
      alignItems="center"
    >
      {/* Botão Voltar */}
      <IconButton
        onClick={() => navigate(-1)}
        size="large"
        sx={{ alignSelf: "start" }}
      >
        <ArrowBack sx={{ fontSize: "2rem" }} />
      </IconButton>

      {/* Imagem Ilustrativa */}
      <Stack>
        <Person sx={{ width: "80px", height: "80px" }} />
      </Stack>

      <Typography variant="h5" fontWeight="bold">
        Bem-vindo ao Evently!
      </Typography>
      <Typography variant="body2" color="textSecondary">
        Faça login para continuar
      </Typography>

      <form onSubmit={handleSubmit} style={{ width: "100%" }}>
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
            startIcon={<LoginIcon />}
            sx={{ mt: 2, py: 1.5, fontSize: "1rem" }}
          >
            Entrar
          </Button>
        </Stack>
      </form>

      {/* Links para recuperação e registro */}
      <Stack alignItems="center" spacing={1} mt={2} width="100%">
        <Typography variant="body2">
          <a href="#" style={{ textDecoration: "none", color: "#1976d2" }}>
            Esqueci minha senha!
          </a>
        </Typography>

        <Divider flexItem sx={{ width: "100%" }} />

        <Typography variant="body2">
          Não possui uma conta?{" "}
          <a
            href="/register"
            style={{
              textDecoration: "none",
              color: "#1976d2",
              fontWeight: "bold",
            }}
          >
            Cadastre-se
          </a>
        </Typography>
      </Stack>

      {/* Snackbar de Feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
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
