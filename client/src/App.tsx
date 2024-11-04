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
  const [loading, setLoading] = useState<boolean>(true);
  const [eventsState, eventsDispatch] = useReducer(eventsReducer, {
    events: [],
  });
  const [categories, setCategories] = useState<category[]>([]);
  const [error, setError] = useState<string | null>(null); // Error state
  const cookies = new Cookies();

  const [page, setPage] = useState<number>(1);
  const [isBottom, setIsBottom] = useState<boolean>(false);
  let scrollTimeout: ReturnType<typeof setTimeout> | null = null;

  useEffect(() => {
    const token = cookies.get("token");
    if (token) {
      userDispatch({ type: "login", payload: token });
    }

    setLoading(true); // Start loading
    let isMounted = true; // Track if component is mounted

    const fetchData = async () => {
      try {
        // Fetch events regardless of user authentication
        const eventsResponse = await axios.get(
          `http://127.0.0.1:3000/api/events?page=${page}`
        );
        if (isMounted) {
          eventsDispatch({
            type: "appendEvents",
            payload: eventsResponse.data,
          });
        }

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
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false; // Cleanup function to prevent state updates
    };
  }, [userState.token, page]); // Add userState.token as a dependency

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, []);

  const handleScroll = () => {
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }

    scrollTimeout = setTimeout(() => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 10
      ) {
        if (!isBottom) {
          setPage((prevPage) => prevPage + 1);
          setIsBottom(true);
        }
      } else {
        setIsBottom(false);
      }
    }, 100);
  };

  return (
    <UserContext.Provider value={{ userState, userDispatch }}>
      <EventsContext.Provider value={{ eventsState, eventsDispatch, loading }}>
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
