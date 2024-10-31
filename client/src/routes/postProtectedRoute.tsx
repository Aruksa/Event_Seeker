import { Navigate } from "react-router-dom";
import { useUserContext } from "../contexts/userContext";

interface ProtectedRouteProps {
  children: JSX.Element;
}

const PostProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { userState } = useUserContext();

  // If a user token exists, redirect to the home page
  return userState.token ? children : <Navigate to="/" replace />;
};

export default PostProtectedRoute;
