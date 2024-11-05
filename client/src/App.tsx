import { Grid, GridItem, Text } from "@chakra-ui/react";
import NavBar from "./components/navBar";
import { Outlet } from "react-router-dom";
import { useEffect, useReducer, useState } from "react";
import { UserContext } from "./contexts/userContext";
import Cookies from "universal-cookie";
import { userReducer } from "./reducers/userReducer";
import { eventsReducer } from "./reducers/eventsReducer";
import axios from "axios";
import { EventsContext } from "./contexts/eventsContext";
import { category } from "./types/category";
import { CategoriesContext } from "./contexts/categoriesContext";

const App = () => {
  const [userState, userDispatch] = useReducer(userReducer, { token: "" });
  // const [loading, setLoading] = useState<boolean>(true);

  const [categories, setCategories] = useState<category[]>([]);
  const [error, setError] = useState<string | null>(null); // Error state
  const cookies = new Cookies();

  const [eventsState, eventsDispatch] = useReducer(eventsReducer, {
    events: [],
  });

  useEffect(() => {
    const token = cookies.get("token");
    if (token) {
      userDispatch({ type: "login", payload: token });
    }

    // setLoading(true);
    let isMounted = true; // Track if component is mounted

    const fetchData = async () => {
      try {
        const categoriesResponse = await axios.get(
          "http://127.0.0.1:3000/api/events/categories"
        );
        if (isMounted) {
          setCategories(categoriesResponse.data);
        }
      } catch (err) {
        console.error(err);
        if (isMounted) {
          setError("Failed to fetch data");
        }
      } finally {
        if (isMounted) {
          // setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false; // Cleanup function to prevent state updates
    };
  }, [userState.token]); // Add userState.token as a dependency

  return (
    <UserContext.Provider value={{ userState, userDispatch }}>
      <EventsContext.Provider value={{ eventsState, eventsDispatch }}>
        <CategoriesContext.Provider value={{ categories, setCategories }}>
          <Grid
            templateAreas={{
              base: `"nav" "main"`,
              // lg: "nav nav" "aside main", //1024
            }}
          >
            <GridItem area="nav">
              <NavBar />
            </GridItem>
            <GridItem area="main">
              <Outlet />
              {error && <Text color="red.500">{error}</Text>}{" "}
              {/* Display error if exists */}
            </GridItem>
          </Grid>
        </CategoriesContext.Provider>
      </EventsContext.Provider>
    </UserContext.Provider>
  );
};

export default App;
