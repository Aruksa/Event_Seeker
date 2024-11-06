import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  Heading,
  HStack,
  Input,
  Stack,
  Text,
  useColorModeValue,
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

  const bgColor = useColorModeValue("gray.50", "gray.800");
  const formBgColor = useColorModeValue("white", "gray.700");

  return (
    <Flex
      height="calc(100vh - 75px)"
      width="full"
      align="center"
      justifyContent="center"
      bg={bgColor}
    >
      <Box
        bg={formBgColor}
        p={8}
        rounded="lg"
        shadow="lg"
        w="full"
        maxW="md"
        borderWidth={1}
        borderColor={useColorModeValue("gray.200", "gray.700")}
      >
        <form onSubmit={handleLogin}>
          <Stack spacing={6}>
            <Heading
              fontSize="3xl"
              textAlign="center"
              color={useColorModeValue("gray.800", "white")}
            >
              Log in to Your Account
            </Heading>

            <FormControl isInvalid={!!errors.email}>
              <Input
                id="email"
                value={formData.email}
                onChange={handleChange}
                variant="filled"
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
                variant="filled"
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
            <HStack justify="center" spacing={1}>
              <Text color={useColorModeValue("gray.600", "gray.400")}>
                Not a member yet?
              </Text>
              <Link to="/register">
                <Button variant="link" color="#00616E">
                  Sign up
                </Button>
              </Link>
            </HStack>
          </Stack>
        </form>
      </Box>
    </Flex>
  );
};

export default Login;
