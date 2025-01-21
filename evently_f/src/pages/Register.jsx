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

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: 1,
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "success",
  });

  const { register } = useAuth();

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((prev) => !prev);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    let tempErrors = {};

    if (!formData.name) {
      tempErrors.name = "O nome de usuário é obrigatório.";
    } else if (!/^[a-zA-Z0-9._-]+$/.test(formData.name)) {
      tempErrors.name =
        "O nome de usuário não deve conter espaços ou caracteres especiais.";
    }

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

    if (formData.confirmPassword !== formData.password) {
      tempErrors.confirmPassword = "As senhas não coincidem.";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        await register(formData);
        setSnackbar({
          open: true,
          message: "Registro realizado com sucesso!",
          type: "success",
        });
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          role: 1,
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message: error.message || "Erro ao realizar o registro.",
          type: "error",
        });
      }
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      <Stack
        component={Paper}
        elevation={5}
        padding={4}
        spacing={3}
        marginTop={10}
        justifySelf={"center"}
      >
        <Typography variant="h5" align="center">
          Cadastre-se no Evently
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <FormControl fullWidth error={!!errors.name}>
              <TextField
                label="Nome"
                placeholder="Digite seu nome ou apelido"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
              />
              {errors.name && <FormHelperText>{errors.name}</FormHelperText>}
            </FormControl>

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

            <FormControl fullWidth error={!!errors.confirmPassword}>
              <OutlinedInput
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirme sua senha"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={
                        showConfirmPassword ? "Ocultar senha" : "Mostrar senha"
                      }
                      onClick={handleClickShowConfirmPassword}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              {errors.confirmPassword && (
                <FormHelperText>{errors.confirmPassword}</FormHelperText>
              )}
            </FormControl>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Cadastrar
            </Button>
          </Stack>
        </form>

        <Stack alignItems={"center"} spacing={2}>
          <a href="/login">Já possui cadastro?</a>
        </Stack>
      </Stack>

      {/* Snackbar para feedback */}
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
    </>
  );
};

export default Register;
