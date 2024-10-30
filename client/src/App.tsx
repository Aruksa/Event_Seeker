import { Grid, GridItem } from "@chakra-ui/react";
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

  const cookies = new Cookies();

  useEffect(() => {
    const token = cookies.get("token");
    if (token) {
      userDispatch({ type: "login", payload: token });
    }

    axios
      .get("http://127.0.0.1:3000/api/events")
      .then((res) => eventsDispatch({ type: "getEvents", payload: res.data }))
      .catch((err) => {
        console.log(err);
      });

    axios
      .get("http://127.0.0.1:3000/api/events/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => {
        console.log(err);
      });
  }, []);

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
            </GridItem>
          </Grid>
        </CategoriesContext.Provider>
      </EventsContext.Provider>
    </UserContext.Provider>
  );
};

export default App;
