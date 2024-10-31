import React from "react";
import ReactDOM from "react-dom/client";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  ChakraProvider,
  ColorModeScript,
} from "@chakra-ui/react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import theme from "./theme";
import "./index.css";
import Login from "./components/login";
import SignUp from "./components/register";
import ProtectedRoute from "./routes/ProtectedRoute";
import EventsGrid from "./components/eventsGrid";
import EventDetails from "./components/eventDetails";
import { EventsSearch } from "./components/eventsSearch";
import EventPost from "./components/eventPost";
import PostProtectedRoute from "./routes/postProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/login",
        element: (
          <ProtectedRoute>
            <Login />
          </ProtectedRoute>
        ),
      },
      {
        path: "/",
        element: <EventsGrid />,
      },
      {
        path: "/post",
        element: (
          <PostProtectedRoute>
            <EventPost />
          </PostProtectedRoute>
        ),
      },

      {
        path: "/events/:id",
        element: <EventDetails />,
      },

      {
        path: "/register",
        element: (
          <ProtectedRoute>
            <SignUp />
          </ProtectedRoute>
        ),
      },
    ],
    errorElement: (
      <Alert borderRadius={10} status="error">
        <AlertIcon />
        <AlertTitle>404 Not Found</AlertTitle>
      </Alert>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <RouterProvider router={router} />
    </ChakraProvider>
  </React.StrictMode>
);
