import { useEffect, useState } from "react";
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
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import EventCard from "./eventCard";
import { event } from "../types/event";
import { CalendarIcon, SearchIcon } from "@chakra-ui/icons";
import axios from "axios";

function EventsGrid() {
  const { eventsState, eventsDispatch, loading } = useEventsContext();
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

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

  const [debouncedInput, setDebouncedInput] = useState(input);

  const events = eventsState.events;

  useEffect(() => {
    const handleSearch = async () => {
      try {
        setPage(1);
        const result = await axios.get<event[]>(
          `http://localhost:3000/api/events?search=${input.search}&venue=${input.venue}&city=${input.city}&country=${input.country}&startDate=${input.startDate}&endDate=${input.endDate}&page=1`
        );
        eventsDispatch({ type: "getEvents", payload: result.data });
      } catch (error: any) {
        setError(error.message);
      }
    };
    handleSearch();
  }, [debouncedInput]);

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
      try {
        const result = await axios.get<event[]>(
          `http://localhost:3000/api/events?search=${input.search}&venue=${input.venue}&city=${input.city}&country=${input.country}&startDate=${input.startDate}&endDate=${input.endDate}&page=${page}`
        );
        const uniqueEvents = [
          ...eventsState.events,
          ...result.data.filter(
            (newEvent) =>
              !eventsState.events.some((event) => event.id === newEvent.id)
          ),
        ];
        eventsDispatch({ type: "getEvents", payload: uniqueEvents });
      } catch (error: any) {
        setError(error.message);
      }
    };
    if (page !== 1) {
      getEvents();
    }
  }, [page]);

  return (
    <VStack>
      <Box p={5} borderWidth={1} borderRadius="lg" boxShadow="md">
        <HStack spacing={6} align="center" wrap="wrap">
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
          <Heading paddingTop={4}>Discover Event Listings</Heading>
          {loading ? ( // Show loader while fetching data
            <Box display="flex" justifyContent="center" padding={10}>
              <Spinner size="lg" />
            </Box>
          ) : events.length === 0 ? (
            <Box padding={10}>
              <Text>No Events Found</Text>
            </Box>
          ) : (
            <SimpleGrid
              columns={{ sm: 1, md: 2, lg: 2, xl: 3 }}
              padding={10}
              spacing={10}
            >
              {events.map((event) => (
                <Link key={event.id} to={`/events/${event.id}`}>
                  <EventCard event={event} />
                </Link>
              ))}
            </SimpleGrid>
          )}
        </Box>
      </Box>
    </VStack>
  );
}

export default EventsGrid;
