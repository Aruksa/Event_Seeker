import { Navigate } from "react-router-dom";
import { useUserContext } from "../contexts/userContext";

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user } = useUserContext();

  // If a user token exists, redirect to the home page
  return user ? <Navigate to="/" replace /> : children;
};

export default ProtectedRoute;
