import { SimpleGrid, Box, Heading, Button, Stack } from "@chakra-ui/react";
import { useEventsContext } from "../contexts/eventsContext";
import { EventsSearch } from "./eventsSearch";
import { Link } from "react-router-dom";
import EventCard from "./eventCard";
import axios from "axios";
import { useEffect, useState } from "react";
import { event } from "../types/event";
import { useUserContext } from "../contexts/userContext";

function EventsMy() {
  const { userState } = useUserContext();
  const [userEvents, setUserEvents] = useState<event[]>([]);
  const { eventsState, eventsDispatch } = useEventsContext();
  const [filteredEvents, setFilteredEvents] = useState<event[]>([]);
  const [resultsFound, setResultsFound] = useState<boolean>(true);
  const [searchActive, setSearchActive] = useState<boolean>(false); // New state to track search activity

  useEffect(() => {
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
  }, []);

  const handleDeleteEvent = async (eventId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event?"
    );
    if (!confirmed) {
      return;
    }
    try {
      // Make sure the URL is correct based on your Express setup
      await axios.delete(`http://127.0.0.1:3000/api/events/${eventId}`, {
        headers: {
          "x-auth-token": userState.token,
        },
      });

      // Update local state to remove the deleted event
      setUserEvents((prevEvents) =>
        prevEvents.filter((event) => event.id !== parseInt(eventId))
      );

      // Optionally dispatch an action to update context state if needed
      eventsDispatch({ type: "deleteEvent", payload: eventId }); // Adjust payload as needed
    } catch (err) {
      console.error("Error deleting event:", err);
    }
  };

  const handleSearchResults = (results: event[]) => {
    setFilteredEvents(results);
    setResultsFound(results.length > 0);
    setSearchActive(results.length > 0 || results.length === 0); // Set search active if results exist or are empty
  };

  const eventsToDisplay =
    searchActive && filteredEvents.length > 0 // Show filtered events if search is active
      ? filteredEvents
      : eventsState.events; // Otherwise, show all events

  return (
    <Box display="flex" justifyContent="center" width="100%">
      <Box width="90%" maxWidth="1200px">
        {" "}
        {/* Adjust width as needed */}
        <EventsSearch
          onSearch={handleSearchResults}
          onResultsFound={setResultsFound}
        />
        <Heading paddingTop={4}>My Events</Heading>
        <SimpleGrid
          columns={{ sm: 1, md: 2, lg: 2, xl: 3 }} // Adjust columns based on screen size
          padding={10}
          spacing={10}
        >
          {eventsToDisplay.length === 0 ? (
            <Box>No Events Found</Box>
          ) : (
            eventsToDisplay.map((event) => (
              <Box key={event.id} borderWidth={1} borderRadius="lg" padding={4}>
                <Link to={`/events/${event.id}`}>
                  <EventCard event={event} />
                </Link>
                <Stack direction="row" spacing={4} marginTop={2}>
                  <Link to={`/events/edit/${event.id}`}>
                    <Button>Edit</Button>
                  </Link>
                  <Button
                    onClick={() => handleDeleteEvent(event.id.toString())}
                  >
                    Delete
                  </Button>
                </Stack>
              </Box>
            ))
          )}
        </SimpleGrid>
      </Box>
    </Box>
  );
}

export default EventsMy;
