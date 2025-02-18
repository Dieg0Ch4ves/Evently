import { AppBar, Button, Stack, Toolbar, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Header = () => {
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  return (
    <AppBar position="static" color="primary" sx={{ paddingX: 2 }}>
      <Toolbar disableGutters>
        <Typography
          variant="h5"
          component="div"
          onClick={() => navigate("/")}
          sx={{ flexGrow: 1, fontWeight: "bold" }}
        >
          Evently
        </Typography>

        {/* Navegação */}
        <Stack direction="row" spacing={2}>
          <Button onClick={() => navigate("/about")} color="inherit">
            Sobre
          </Button>

          {user ? (
            <>
              <Button color="inherit" onClick={() => navigate("/dashboard")}>
                Dashboard
              </Button>
              <Button color="inherit" onClick={logout}>
                Sair
              </Button>
            </>
          ) : (
            <>
              <Button onClick={() => navigate("/login")} color="inherit">
                Entrar
              </Button>
              <Button onClick={() => navigate("/register")} color="inherit">
                Cadastre-se
              </Button>
            </>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
