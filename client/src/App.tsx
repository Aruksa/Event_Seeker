import {
  Center,
  Grid,
  GridItem,
  Skeleton,
  Stack,
  Text,
} from "@chakra-ui/react";
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
  const [eventsState, eventsDispatch] = useReducer(eventsReducer, {
    events: [],
  });

  const [categories, setCategories] = useState<category[]>([]);
  const [page, setPage] = useState<number>(1);
  const [isBottom, setIsBottom] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [noMoreEvents, setNoMoreEvents] = useState<boolean>(false);

  const cookies = new Cookies();

  const handleScroll = () => {
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
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const token = cookies.get("token");
    if (token) {
      userDispatch({ type: "login", payload: token });
    }

    axios
      .get("http://127.0.0.1:3000/api/events/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://127.0.0.1:3000/api/events?limit=4&page=${page}`
        );
        if (response.data.length === 0) {
          setNoMoreEvents(true); // Set noMoreEvents to true if no events are returned
        } else {
          eventsDispatch({
            type: "getEvents",
            payload: [...eventsState.events, ...response.data],
          });
        }
      } catch (err) {
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    if (!noMoreEvents) {
      fetchEvents();
    }
  }, [page]);

  return (
    <UserContext.Provider value={{ userState, userDispatch }}>
      <EventsContext.Provider value={{ eventsState, eventsDispatch }}>
        <CategoriesContext.Provider value={{ categories, setCategories }}>
          <Grid
            templateAreas={{
              base: `"nav" "main"`,
              // lg: `"nav nav" "aside main"`, //1024
            }}
          >
            <GridItem area="nav">
              <NavBar />
            </GridItem>
            <GridItem area="main">
              <Outlet />
              {/* Skeleton loader displayed when loading is true */}
              {loading && (
                <Stack spacing={4} mt={4}>
                  <Skeleton height="200px" />
                  <Skeleton height="200px" />
                  <Skeleton height="200px" />
                  <Skeleton height="200px" />
                </Stack>
              )}

              {/* "No More Events" message when noMoreEvents is true */}
              {/* {!loading && noMoreEvents && (
                <Center mt={4}>
                  <Text fontSize="lg" color="gray.500">
                    No more events to show!
                  </Text>
                </Center>
              )} */}
            </GridItem>
          </Grid>
        </CategoriesContext.Provider>
      </EventsContext.Provider>
    </UserContext.Provider>
  );
};

export default App;
