import {
  AppBar,
  Button,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Home } from "@mui/icons-material";

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
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
          width={"100%"}
        >
          <Stack direction={"row"} spacing={2} alignItems={"center"}>
            <Typography variant="h5">Evently</Typography>
            <IconButton variant="text" onClick={() => navigate("/")}>
              <Home />
            </IconButton>
          </Stack>

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
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
