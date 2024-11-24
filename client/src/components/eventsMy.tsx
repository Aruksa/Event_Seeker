import { useEffect, useRef, useState } from "react";
import { useEventsContext } from "../contexts/eventsContext";
import {
  SimpleGrid,
  Box,
  Heading,
  Text,
  Spinner,
  VStack,
  HStack,
  InputGroup,
  InputLeftElement,
  Input,
  Stack,
  Button,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Flex,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import EventCard from "./eventCard";
import { event } from "../types/event";
import { CalendarIcon, SearchIcon } from "@chakra-ui/icons";
import axios from "axios";
import { useUserContext } from "../contexts/userContext";
import { FaEdit, FaEllipsisV, FaTrash } from "react-icons/fa";
import { showToast } from "../services/showToast";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../state/store";
import { deleteEvent } from "../state/eventsSlice";

function EventsMy() {
  const { userState } = useUserContext();
  // const { eventsDispatch } = useEventsContext();
  const events = useSelector((state: RootState) => state.events);
  const dispatch = useDispatch();

  const [myEvents, setMyEvents] = useState<event[]>([]);

  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);

  const [isBottom, setIsBottom] = useState(false);
  let scrollTimeout: ReturnType<typeof setTimeout> | null = null;

  const [input, setInput] = useState({
    search: "",
    venue: "",
    city: "",
    country: "",
    startDate: "",
    endDate: "",
  });

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
      setMyEvents((prevEvents) =>
        prevEvents.filter((event) => event.id !== parseInt(eventId))
      );

      dispatch(deleteEvent(parseInt(eventId)));
      // eventsDispatch({ type: "deleteEvent", payload: eventId });
    } catch (err: any) {
      showToast("error", err.message);
    } finally {
      showToast("success", "Event deleted successfully :)");
    }
  };

  const [debouncedInput, setDebouncedInput] = useState(input);

  const [hasMore, setHasMore] = useState(true);
  const hasMoreRef = useRef(hasMore);

  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

  useEffect(() => {
    const handleSearch = async () => {
      try {
        if (!userState.token) return;
        setLoading(true);
        setPage(1);
        setHasMore(true); // Reset hasMore on a new search
        const result = await axios.get<event[]>(
          `http://localhost:3000/api/events/myEvents?search=${input.search}&venue=${input.venue}&city=${input.city}&country=${input.country}&startDate=${input.startDate}&endDate=${input.endDate}&page=1`,
          {
            headers: {
              "x-auth-token": userState.token,
            },
          }
        );
        setMyEvents(result.data);
        setLoading(false);
      } catch (error: any) {
        setError(error.message);
      }
    };
    handleSearch();
  }, [debouncedInput, userState.token]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedInput(input);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [input]);

  const handleScroll = () => {
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }

    scrollTimeout = setTimeout(() => {
      if (!hasMoreRef.current) {
        console.log("No more pages to load."); // Debugging line
        return; // Exit if no more pages are available
      }
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

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, []);

  useEffect(() => {
    const getEvents = async () => {
      if (!hasMoreRef.current) return; // Early exit if no more pages
      try {
        if (!userState.token) return;
        // setLoading(true);
        const result = await axios.get<event[]>(
          `http://localhost:3000/api/events/myEvents?search=${input.search}&venue=${input.venue}&city=${input.city}&country=${input.country}&startDate=${input.startDate}&endDate=${input.endDate}&page=${page}`,
          {
            headers: {
              "x-auth-token": userState.token,
            },
          }
        );
        if (result.data.length === 0) {
          setHasMore(false); // No more pages to fetch
          // setLoading(false);
        } else {
          const uniqueEvents = [
            ...myEvents,
            ...result.data.filter(
              (newEvent) => !myEvents.some((event) => event.id === newEvent.id)
            ),
          ];
          setMyEvents(uniqueEvents);
          // setLoading(false);
        }
      } catch (error: any) {
        setError(error.message);
      }
    };
    if (page !== 1) {
      getEvents();
    }
  }, [page, userState.token]);

  return (
    <VStack>
      <Box p={5} borderWidth={1} borderRadius="lg" boxShadow="md">
        <HStack spacing={6} align="center" wrap="nowrap">
          <InputGroup size="sm" maxWidth="200px">
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.500" />
            </InputLeftElement>
            <Input
              placeholder="Search by Title"
              value={input.search}
              onChange={(e) => setInput({ ...input, search: e.target.value })}
            />
          </InputGroup>
          <Input
            placeholder="Venue"
            size="sm"
            maxWidth="150px"
            value={input.venue}
            onChange={(e) => setInput({ ...input, venue: e.target.value })}
          />
          <Input
            placeholder="City"
            size="sm"
            maxWidth="150px"
            value={input.city}
            onChange={(e) => setInput({ ...input, city: e.target.value })}
          />
          <Input
            placeholder="Country"
            size="sm"
            maxWidth="150px"
            value={input.country}
            onChange={(e) => setInput({ ...input, country: e.target.value })}
          />
          <InputGroup size="sm" maxWidth="190px">
            <InputLeftElement pointerEvents="none">
              <CalendarIcon color="gray.500" />
            </InputLeftElement>
            <Input
              type="date"
              placeholder="Start Date"
              value={input.startDate}
              onChange={(e) =>
                setInput({ ...input, startDate: e.target.value })
              }
            />
          </InputGroup>
          <InputGroup size="sm" maxWidth="190px">
            <InputLeftElement pointerEvents="none">
              <CalendarIcon color="gray.500" />
            </InputLeftElement>
            <Input
              type="date"
              placeholder="End Date"
              value={input.endDate}
              onChange={(e) => setInput({ ...input, endDate: e.target.value })}
            />
          </InputGroup>
        </HStack>
      </Box>
      <Box display="flex" justifyContent="center" width="100%">
        <Box width="90%" maxWidth="1200px">
          {" "}
          {/* Adjust width as needed */}
          <Heading paddingTop={4} paddingLeft={7}>
            My Events
          </Heading>
          {loading ? ( // Show loader while fetching data
            <Box display="flex" justifyContent="center" padding={10}>
              <Spinner size="lg" />
            </Box>
          ) : myEvents.length === 0 ? (
            <Box padding={10}>
              <Text>No Events Found</Text>
            </Box>
          ) : (
            <SimpleGrid
              columns={{ sm: 1, md: 2, lg: 2, xl: 3 }}
              padding={10}
              spacing={10}
            >
              {myEvents.map((event) => (
                <Box position="relative" key={event.id}>
                  {/* Link to the event details */}
                  <Link to={`/events/${event.id}`}>
                    <EventCard event={event} />
                  </Link>

                  {/* Three-dot menu in the top right */}
                  <Box position="absolute" top="8px" right="8px">
                    <HStack spacing={4}>
                      {" "}
                      {/* This will arrange the buttons horizontally */}
                      <IconButton
                        as={Link}
                        to={`/events/edit/${event.id}`}
                        aria-label="Edit"
                        icon={<FaEdit />}
                        variant="solid"
                        size="sm"
                        colorScheme="blue" // Set the color of the button
                        _hover={{ bg: "rgba(0, 0, 0, 0.1)" }} // Subtle hover effect
                      />
                      <IconButton
                        onClick={() => handleDeleteEvent(event.id.toString())}
                        aria-label="Delete"
                        icon={<FaTrash />}
                        variant="solid"
                        size="sm"
                        colorScheme="red" // Set the color of the delete button
                        _hover={{ bg: "rgba(0, 0, 0, 0.1)" }} // Subtle hover effect
                      />
                    </HStack>
                  </Box>
                </Box>
              ))}
            </SimpleGrid>
          )}
        </Box>
      </Box>
    </VStack>
  );
}

export default EventsMy;
