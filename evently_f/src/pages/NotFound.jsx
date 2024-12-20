import { Button, Paper, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <Stack
      component={Paper}
      elevation={5}
      spacing={2}
      padding={2}
      marginTop={20}
      justifySelf={"center"}
      alignItems={"center"}
    >
      <Typography variant="body1">
        ⚠️ Pagina não encontrada ou não existe! ⚠️
      </Typography>

      <Button onClick={handleBackToHome} variant="contained" color="primary">
        Voltar
      </Button>
    </Stack>
  );
};

export default NotFound;
