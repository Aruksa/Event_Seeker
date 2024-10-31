import { useState } from "react";
import { useEventsContext } from "../contexts/eventsContext";
import { SimpleGrid, Box } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import EventCard from "./eventCard";
import { EventsSearch } from "./eventsSearch";

function EventsGrid() {
  const { eventsState, eventsDispatch } = useEventsContext();

  const events = eventsState.events;
  const [error, setError] = useState("");
  const [isError, setIsError] = useState(false);

  // console.log(events);

  return (
    <Box display="flex" justifyContent="center" width="100%">
      <Box width="90%" maxWidth="1200px">
        {" "}
        {/* Adjust width as needed */}
        <EventsSearch />
        <SimpleGrid
          columns={{ sm: 1, md: 2, lg: 2, xl: 3 }} // Adjust columns based on screen size
          padding={10}
          spacing={10}
        >
          {events.map((event) => (
            <Link key={event.id} to={`/events/${event.id}`}>
              <EventCard event={event} />
            </Link>
          ))}
        </SimpleGrid>
      </Box>
    </Box>
  );
}

export default EventsGrid;
