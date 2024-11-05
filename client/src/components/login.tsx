import {
  Alert,
  AlertIcon,
  AlertTitle,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
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
import { showToast } from "../services/showToast";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const cookies = new Cookies();
  const { userDispatch } = useUserContext();

  const [errors, setErrors] = useState<{
    email: string;
    password: string;
    general?: string;
  }>({
    email: "",
    password: "",
  });

  const isEmailValid = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordValid = (password: string) => password.length >= 8;

  const isFormValid =
    isEmailValid(formData.email) && isPasswordValid(formData.password);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 30);

    if (!isEmailValid(formData.email) || !isPasswordValid(formData.password)) {
      setErrors({
        email: !isEmailValid(formData.email) ? "Invalid email address" : "",
        password: !isPasswordValid(formData.password)
          ? "Password must be at least 8 characters"
          : "",
      });
      showToast(
        "error",
        "Please enter valid email and password.",
        "Login Failed"
      ); // ADD TOAST FOR INVALID INPUTS
      return;
    }

    try {
      const response = await loginUser(formData);
      userDispatch({ type: "login", payload: response });
      const set = await cookies.set("token", response, {
        expires: expirationDate,
      });
      setFormData({ email: "", password: "" });
      showToast("success", "Logged in successfully!", "Login Success");
    } catch (err: any) {
      setErrors({ ...errors, general: err.message });
      showToast(
        "error",
        err.message || "Login failed, please try again.",
        "Login Failed"
      ); // ERROR TOAST WITH GENERAL MESSAGE
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setFormData({ ...formData, [id]: value });

    // CLEAR ERROR MESSAGES ON INPUT CHANGE
    if (errors[id as "email" | "password"]) {
      setErrors({ ...errors, [id]: "" });
    }
  };

  return (
    <Flex alignItems="center" justifyContent="center">
      <form onSubmit={handleLogin}>
        <Heading padding="20px" fontSize="4xl" textAlign="center">
          Log in
        </Heading>
        <Stack padding="10px" spacing={7} boxSize={450}>
          {/* {errors.general && (
            <Alert borderRadius={10} status="error">
              <AlertIcon />
              <AlertTitle>{errors.general}</AlertTitle>
            </Alert>
          )} */}
          <FormControl isInvalid={!!errors.email}>
            <Input
              id="email"
              value={formData.email}
              onChange={handleChange}
              variant="outline"
              placeholder="Email"
            />
            <FormErrorMessage>{errors.email}</FormErrorMessage>{" "}
            {/* EMAIL ERROR */}
          </FormControl>

          <FormControl isInvalid={!!errors.password}>
            <Input
              id="password"
              value={formData.password}
              onChange={handleChange}
              type="password"
              variant="outline"
              placeholder="Password"
            />
            <FormErrorMessage>{errors.password}</FormErrorMessage>{" "}
            {/* PASSWORD ERROR */}
          </FormControl>
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
