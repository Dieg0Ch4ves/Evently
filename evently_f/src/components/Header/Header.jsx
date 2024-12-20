import { AppBar, Button, Stack, Toolbar, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <AppBar position="static" color="primary" sx={{ paddingX: 2 }}>
      <Toolbar disableGutters>
        <Typography
          variant="h5"
          component="div"
          sx={{ flexGrow: 1, fontWeight: "bold" }}
        >
          Evently
        </Typography>

        {/* Navegação */}
        <Stack direction="row" spacing={2}>
          <Button onClick={() => navigate("login")} color="inherit">
            Entrar
          </Button>
          <Button onClick={() => navigate("register")} color="inherit">
            Cadastre-se
          </Button>
          <Button onClick={() => navigate("about")} color="inherit">
            Sobre
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
