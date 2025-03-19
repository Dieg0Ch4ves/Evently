import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import ActivateUser from "./pages/ActivateUser";
import AdminPanel from "./pages/AdminPanel";
import Dashboard from "./pages/Dashboard";
import Event from "./pages/Event";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import { AuthProvider } from "./providers/AuthProvider";
import ProtectedRoute from "./utils/ProtectedRoute";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rotas com Header */}
          <Route
            path="/"
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />

          <Route
            path="register"
            element={
              <Layout>
                <Register />
              </Layout>
            }
          />

          <Route
            path="event/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  <Event />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="admin"
            element={
              <ProtectedRoute>
                <Layout>
                  <AdminPanel />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Rotas sem Header */}
          <Route path="login" element={<Login />} />

          <Route path="activate" element={<ActivateUser />} />

          <Route path="forgot-password" element={<ForgotPassword />} />

          {/* Página de erro */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
