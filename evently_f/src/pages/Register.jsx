import { ArrowBack, Person, PersonAdd } from "@mui/icons-material";
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
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((prev) => !prev);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    let tempErrors = {};
    if (!formData.name) tempErrors.name = "Nome é obrigatório.";
    if (!formData.email) tempErrors.email = "E-mail é obrigatório.";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      tempErrors.email = "E-mail inválido.";
    if (!formData.password) tempErrors.password = "Senha obrigatória.";
    else if (formData.password.length < 6)
      tempErrors.password = "Mínimo de 6 caracteres.";
    if (formData.confirmPassword !== formData.password)
      tempErrors.confirmPassword = "As senhas não coincidem.";
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
          message: "Cadastro realizado com sucesso!",
          type: "success",
        });
        navigate("/login");
      } catch (error) {
        setSnackbar({
          open: true,
          message: error.message || "Erro ao cadastrar.",
          type: "error",
        });
      }
    }
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  return (
    <Stack
      component={Paper}
      elevation={5}
      borderRadius={3}
      padding={4}
      spacing={2}
      maxWidth={600}
      width={"100%"}
      alignSelf={"center"}
      alignItems="center"
    >
      <IconButton
        onClick={() => navigate(-1)}
        size="large"
        sx={{ alignSelf: "start" }}
      >
        <ArrowBack sx={{ fontSize: "2rem" }} />
      </IconButton>

      <Stack>
        <Person sx={{ width: "80px", height: "80px" }} />
      </Stack>

      <Typography variant="h5" fontWeight="bold">
        Crie sua conta
      </Typography>
      <Typography variant="body2" color="textSecondary">
        Registre-se para acessar o Evently
      </Typography>

      <form onSubmit={handleSubmit} style={{ width: "100%" }}>
        <Stack spacing={2}>
          <TextField
            label="Nome"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
            fullWidth
          />
          <TextField
            label="E-mail"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            fullWidth
          />
          <FormControl fullWidth error={!!errors.password}>
            <OutlinedInput
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Digite sua senha"
              endAdornment={
                <InputAdornment position="end">
                  <IconButton onClick={handleClickShowPassword} edge="end">
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
            startIcon={<PersonAdd />}
            sx={{ mt: 2, py: 1.5, fontSize: "1rem" }}
          >
            Cadastrar
          </Button>
        </Stack>
      </form>

      <Stack alignItems="center" spacing={1} mt={2} width="100%">
        <Divider flexItem sx={{ width: "100%" }} />
        <Typography variant="body2">
          Já possui uma conta?{" "}
          <a
            href="/login"
            style={{
              textDecoration: "none",
              color: "#1976d2",
              fontWeight: "bold",
            }}
          >
            Faça login
          </a>
        </Typography>
      </Stack>

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

export default Register;
