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
import { createUser } from "../services/createUser";
import { Link } from "react-router-dom";
import Cookies from "universal-cookie";
import { useUserContext } from "../contexts/userContext";
import { showToast } from "../services/showToast";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const cookies = new Cookies();
  const { userDispatch } = useUserContext();

  const [errors, setErrors] = useState<{
    name: string;
    email: string;
    password: string;
    general?: string;
  }>({
    name: "",
    email: "",
    password: "",
  });

  const isEmailValid = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordValid = (password: string) => password.length >= 8;

  const isFormValid =
    formData.name.trim() !== "" &&
    isEmailValid(formData.email) &&
    isPasswordValid(formData.password);

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();

    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 30);

    if (isFormValid) {
      try {
        const response = await createUser(formData);
        userDispatch({ type: "login", payload: response });
        const set = await cookies.set("token", response, {
          expires: expirationDate,
        });
        console.log("Signup successful:", response);
        setFormData({ name: "", email: "", password: "" });
        showToast("success", "Registration successful!");
      } catch (err: any) {
        setErrors({ ...errors, general: err.message });
        showToast("error", err.message, "This email is already in use.");
      }
    } else {
      setErrors({
        name: formData.name.trim() === "" ? "Name is required" : "",
        email: !isEmailValid(formData.email) ? "Invalid email address" : "",
        password: !isPasswordValid(formData.password)
          ? "Password must be at least 8 characters"
          : "",
      });
      // showToast("error", "Please input all fields correctly.", "Register");
    }
  };

  // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setFormData({ ...formData, [event.target.id]: event.target.value });
  //   if (isError) {
  //     setError("");
  //     setIsError(false);
  //   }
  // };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setFormData({ ...formData, [id]: value });

    if (id === "name" && errors.name) {
      setErrors({ ...errors, name: "" });
    } else if (id === "email" && errors.email) {
      setErrors({ ...errors, email: "" });
    } else if (id === "password" && errors.password) {
      setErrors({ ...errors, password: "" });
    }
  };

  return (
    <Flex alignItems="center" justifyContent="center">
      <form onSubmit={handleSignup}>
        <Heading padding="20px" fontSize="4xl" textAlign="center">
          Sign up
        </Heading>
        <Stack padding="10px" spacing={7} boxSize={450}>
          {/* {errors.general && (
            <Alert borderRadius={10} status="error">
              <AlertIcon />
              <AlertTitle>{errors.general}</AlertTitle>
            </Alert>
          )} */}

          <FormControl isInvalid={!!errors.name}>
            <Input
              id="name"
              value={formData.name}
              onChange={handleChange}
              variant="outline"
              placeholder="Name"
            />
            <FormErrorMessage>{errors.name}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.email}>
            <Input
              id="email"
              value={formData.email}
              onChange={handleChange}
              variant="outline"
              placeholder="Email"
            />
            <FormErrorMessage>{errors.email}</FormErrorMessage>
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
            <FormErrorMessage>{errors.password}</FormErrorMessage>
          </FormControl>
          <Button
            type="submit"
            bg="#e83e6b"
            color={"white"}
            _hover={{
              bg: "#B91C48",
            }}
          >
            Sign up
          </Button>
          <HStack justify="center">
            <Text>Already a member?</Text>
            <Link to="/login">
              <Button variant="link" color="#00616E">
                Log in
              </Button>
            </Link>
          </HStack>
        </Stack>
      </form>
    </Flex>
  );
};

export default SignUp;
