import { AppBar, Button, Stack, Toolbar, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Header = () => {
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  return (
    <AppBar
      position="fixed"
      color="primary" // Set color to primary
      sx={{
        paddingX: 2,
        backdropFilter: "blur(10px)", // Blur effect
        backgroundColor: "rgba(63, 81, 181, 0.2)", // Translucent background color
        color: "black",
      }}
    >
      <Toolbar disableGutters>
        <Typography
          variant="h5"
          component="div"
          onClick={() => navigate("/")}
          sx={{ flexGrow: 1, fontWeight: "bold", cursor: "pointer" }}
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
