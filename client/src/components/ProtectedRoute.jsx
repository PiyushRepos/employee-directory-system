import { Navigate } from "react-router-dom";
import { useUser } from "../context/userContext.jsx";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useUser();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
