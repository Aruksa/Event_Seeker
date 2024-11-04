import { Navigate } from "react-router-dom";
import Cookies from "universal-cookie";

interface ProtectedRouteProps {
  children: JSX.Element;
}

const PostProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const cookies = new Cookies();
  const token = cookies.get("token");

  const isAuthenticated = !!token;

  // If a user token does not exist, redirect to the home page
  return isAuthenticated ? children : <Navigate to="/" replace />;
};

export default PostProtectedRoute;
