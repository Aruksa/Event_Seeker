import { SimpleGrid, Box, Heading, Button, Stack } from "@chakra-ui/react";
import { useEventsContext } from "../contexts/eventsContext";
import { EventsSearch } from "./eventsSearch";
import { Link } from "react-router-dom";
import EventCard from "./eventCard";
import axios from "axios";
import { useState } from "react";
import { event } from "../types/event";
import { useUserContext } from "../contexts/userContext";

function EventsMy() {
  const { userState } = useUserContext();
  const [userEvents, setUserEvents] = useState<event[]>([]);
  axios
    .get("http://127.0.0.1:3000/api/events/myEvents", {
      headers: {
        "x-auth-token": userState.token,
      },
    })
    .then((res) => setUserEvents(res.data))
    .catch((err) => {
      console.log(err);
    });
  return (
    <Box display="flex" justifyContent="center" width="100%">
      <Box width="90%" maxWidth="1200px">
        {" "}
        {/* Adjust width as needed */}
        <EventsSearch />
        <Heading paddingTop={4}>My Events</Heading>
        <SimpleGrid
          columns={{ sm: 1, md: 2, lg: 2, xl: 3 }} // Adjust columns based on screen size
          padding={10}
          spacing={10}
        >
          {userEvents.map((event) => (
            <Box key={event.id} borderWidth={1} borderRadius="lg" padding={4}>
              <Link to={`/events/${event.id}`}>
                <EventCard event={event} />
              </Link>
              <Stack direction="row" spacing={4} marginTop={2}>
                <Button>Edit</Button>
                <Button>Delete</Button>
              </Stack>
            </Box>
          ))}
        </SimpleGrid>
      </Box>
    </Box>
  );
}

export default EventsMy;
