import { useState } from "react";
import { useEventsContext } from "../contexts/eventsContext";
import { SimpleGrid } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import EventCard from "./eventCard";

function EventsGrid() {
  const { eventsState, eventsDispatch } = useEventsContext();

  const events = eventsState.events;
  const [error, setError] = useState("");
  const [isError, setIsError] = useState(false);

  console.log(events);

  return (
    <SimpleGrid
      columns={{ sm: 1, md: 2, lg: 3, xl: 5 }}
      padding={10}
      spacing={10}
    >
      {events.map((event) => (
        <Link key={event.id} to={`/events/${event.id}`}>
          <EventCard key={event.id} event={event}></EventCard>
        </Link>
      ))}
    </SimpleGrid>
  );
}

export default EventsGrid;
