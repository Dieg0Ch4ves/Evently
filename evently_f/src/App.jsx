import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Layout from "./components/Layout/Layout";
import Event from "./pages/Event";
import ProtectedRoute from "./utils/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import { AuthProvider } from "./providers/AuthProvider";

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
          {/* Rotas sem Header */}
          <Route path="login" element={<Login />} />
          {/* Página de erro */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
