import { Grid, GridItem } from "@chakra-ui/react";
import NavBar from "./components/navBar";
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { UserContext } from "./contexts/userContext";
import Cookies from "universal-cookie";

const App = () => {
  const [user, setUser] = useState("");

  const cookies = new Cookies();

  useEffect(() => {
    setUser(cookies.get("token"));
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
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
    </UserContext.Provider>
  );
};

export default App;
