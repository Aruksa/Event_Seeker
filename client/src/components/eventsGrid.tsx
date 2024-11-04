import { useEffect, useState } from "react";
import { useEventsContext } from "../contexts/eventsContext";
import { SimpleGrid, Box, Heading, Text, Spinner } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import EventCard from "./eventCard";
import { EventsSearch } from "./eventsSearch";
import { event } from "../types/event";

function EventsGrid() {
  const { eventsState, eventsDispatch, loading } = useEventsContext();

  // const [error, setError] = useState("");
  // const [isError, setIsError] = useState(false);

  // console.log(events);

  const [filteredEvents, setFilteredEvents] = useState<event[]>([]);
  const [resultsFound, setResultsFound] = useState<boolean>(true);

  const handleSearchResults = (results: event[]) => {
    setFilteredEvents(results.length > 0 ? results : []);
    setResultsFound(results.length > 0);
  };

  const eventsToDisplay =
    filteredEvents.length > 0 // Show filtered events if found
      ? filteredEvents
      : !resultsFound // If no results found and resultsFound is false
      ? []
      : eventsState.events;

  return (
    <Box display="flex" justifyContent="center" width="100%">
      <Box width="90%" maxWidth="1200px">
        {" "}
        {/* Adjust width as needed */}
        <EventsSearch
          onSearch={handleSearchResults}
          onResultsFound={setResultsFound}
        />
        <Heading paddingTop={4}>Discover Event Listings</Heading>
        {loading ? ( // Show loader while fetching data
          <Box display="flex" justifyContent="center" padding={10}>
            <Spinner size="lg" />
          </Box>
        ) : eventsToDisplay.length === 0 ? (
          <Box padding={10}>
            <Text>No Events Found</Text>
          </Box>
        ) : (
          <SimpleGrid
            columns={{ sm: 1, md: 2, lg: 2, xl: 3 }}
            padding={10}
            spacing={10}
          >
            {eventsToDisplay.map((event) => (
              <Link key={event.id} to={`/events/${event.id}`}>
                <EventCard event={event} />
              </Link>
            ))}
          </SimpleGrid>
        )}
      </Box>
    </Box>
  );
}

export default EventsGrid;
