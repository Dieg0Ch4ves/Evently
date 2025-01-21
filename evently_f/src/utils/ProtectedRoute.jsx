import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from "../contexts/AuthContext";
import { Backdrop } from "@mui/material";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <Backdrop>Carregando...</Backdrop>;

  return user ? children : <Navigate to="/login" />;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
