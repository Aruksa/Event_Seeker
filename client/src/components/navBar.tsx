import { Button, HStack } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useUserContext } from "../contexts/userContext";
import Cookies from "universal-cookie";

const NavBar = () => {
  const cookies = new Cookies();
  const handleLogout = () => {
    setUser("");
    cookies.remove("token");
  };

  const { user, setUser } = useUserContext();
  return (
    <HStack justifyContent="space-between" padding="20px">
      <Link to="/">
        <Button>Home</Button>
      </Link>
      {user ? (
        <Button onClick={handleLogout}>Logout</Button>
      ) : (
        <Link to="/login">
          <Button colorScheme="orange">Login</Button>
        </Link>
      )}
    </HStack>
  );
};

export default NavBar;
