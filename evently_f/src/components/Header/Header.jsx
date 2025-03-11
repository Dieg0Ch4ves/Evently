import {
  AppBar,
  Button,
  IconButton,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  AdminPanelSettings,
  Dashboard,
  Home,
  Logout,
} from "@mui/icons-material";
import { useAuth } from "../../hooks/useAuth";

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
          <Typography variant="h5">Evently</Typography>

          {/* Navegação */}
          <Stack direction="row" spacing={2}>
            <Tooltip title="Home">
              <IconButton
                size="large"
                color="inherit"
                onClick={() => navigate("/")}
              >
                <Home />
              </IconButton>
            </Tooltip>

            {user ? (
              <>
                <Tooltip title="Dashboard">
                  <IconButton
                    size="large"
                    color="inherit"
                    onClick={() => navigate("/dashboard")}
                  >
                    <Dashboard />
                  </IconButton>
                </Tooltip>

                {user.role === "ADMIN" && (
                  <Tooltip title="Admin">
                    <IconButton
                      size="large"
                      color="inherit"
                      onClick={() => navigate("/admin")}
                    >
                      <AdminPanelSettings />
                    </IconButton>
                  </Tooltip>
                )}

                <Tooltip title="Sair">
                  <IconButton size="large" color="inherit" onClick={logout}>
                    <Logout />
                  </IconButton>
                </Tooltip>
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
