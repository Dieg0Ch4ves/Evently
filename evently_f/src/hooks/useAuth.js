import { useContext } from "react";
import AuthContext from "../contexts/AuthContext";

// Hook para usar o AuthContext
export const useAuth = () => useContext(AuthContext);
