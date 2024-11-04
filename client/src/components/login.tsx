import {
  Alert,
  AlertIcon,
  AlertTitle,
  Button,
  Flex,
  Heading,
  HStack,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { FormEvent, useState } from "react";
import { loginUser } from "../services/authUser";
import { Link } from "react-router-dom";
import { useUserContext } from "../contexts/userContext";
import Cookies from "universal-cookie";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const cookies = new Cookies();
  const { userDispatch } = useUserContext();

  const [error, setError] = useState("");
  const [isError, setIsError] = useState(false);

  const isEmailValid = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordValid = (password: string) => password.length >= 8;

  const isFormValid =
    isEmailValid(formData.email) && isPasswordValid(formData.password);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 30);

    if (isFormValid) {
      try {
        const response = await loginUser(formData);
        userDispatch({ type: "login", payload: response });
        const set = await cookies.set("token", response, {
          expires: expirationDate,
        });
        setFormData({ email: "", password: "" });
        console.log("Login successful, token received:", response);
      } catch (err) {
        setError("Login failed. Please try again.");
        setIsError(true);
      }
    } else {
      setError("Please fill in all fields correctly.");
      setIsError(true);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [event.target.id]: event.target.value });
    if (isError) {
      setError("");
      setIsError(false);
    }
  };

  return (
    <Flex alignItems="center" justifyContent="center">
      <form onSubmit={handleLogin}>
        <Heading padding="20px" fontSize="4xl" textAlign="center">
          Log in
        </Heading>
        <Stack padding="10px" spacing={7} boxSize={450}>
          {isError && (
            <Alert borderRadius={10} status="error">
              <AlertIcon />
              <AlertTitle>{error}</AlertTitle>
            </Alert>
          )}
          <Input
            id="email"
            value={formData.email}
            onChange={handleChange}
            variant="outline"
            placeholder="Email"
          />
          <Input
            id="password"
            value={formData.password}
            onChange={handleChange}
            type="password"
            variant="outline"
            placeholder="Password"
          />
          <Button
            type="submit"
            bg="#e83e6b"
            color={"white"}
            _hover={{
              bg: "#B91C48",
            }}
          >
            Log in
          </Button>
          <HStack justify="center">
            <Text>Not a member yet?</Text>
            <Link to="/register">
              <Button variant="link" color="#00616E">
                Sign up
              </Button>
            </Link>
          </HStack>
        </Stack>
      </form>
    </Flex>
  );
};

export default Login;
