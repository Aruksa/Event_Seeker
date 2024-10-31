import { Button, HStack, Image, Spacer } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from "../contexts/userContext";
import Cookies from "universal-cookie";
import { IoHome } from "react-icons/io5";

const NavBar = () => {
  const navigate = useNavigate();
  const { userState, userDispatch } = useUserContext();

  const cookies = new Cookies();
  const handleLogout = async () => {
    userDispatch({ type: "logout", payload: "" });
    await cookies.remove("token");
    navigate("/");
  };

  return (
    <HStack justifyContent="flex-start" padding="20px">
      <Link to="/">
        <Button>
          <IoHome></IoHome>
        </Button>
      </Link>
      <Spacer />
      {userState.token ? (
        <>
          <Link to={"/post"}>
            <Button>Create New</Button>
          </Link>
          <Button onClick={handleLogout}>Logout</Button>
        </>
      ) : (
        <>
          <Link to="/login">
            <Button
              bg="transparent"
              border="none"
              _hover={{
                color: "#00616E",
              }}
            >
              Login
            </Button>
          </Link>
          <Link to="/register">
            <Button
              bg="#00616E"
              color="white"
              _hover={{
                bg: "#003A42",
              }}
            >
              Sign up
            </Button>
          </Link>
        </>
      )}
    </HStack>
  );
};

export default NavBar;
