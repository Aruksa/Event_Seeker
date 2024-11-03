import {
  Input,
  Box,
  InputGroup,
  InputLeftElement,
  HStack,
  VStack,
  Text,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { CalendarIcon, SearchIcon } from "@chakra-ui/icons";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { event } from "../types/event";

export const EventsSearch = ({
  onSearch,
  onResultsFound,
}: {
  onSearch: (results: event[]) => void;
  onResultsFound: (found: boolean) => void;
}) => {
  const [search, setSearch] = useState("");
  const [venue, setVenue] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [previewResults, setPreviewResults] = useState<event[]>([]);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  // Function to load preview results as the user types
  const loadPreviewResults = () => {
    // Only call the API if at least one field is filled
    if (!search && !venue && !city && !country && !startDate && !endDate) {
      setPreviewResults([]);
      onResultsFound(false);
      return;
    }

    axios
      .get(
        `http://localhost:3000/api/events?search=${search}&venue=${venue}&city=${city}&country=${country}&startDate=${startDate}&endDate=${endDate}`
      )
      .then((res) => {
        setPreviewResults(res.data);
        onResultsFound(res.data.length > 0);
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    // Check if any field is filled
    const isAnyFieldFilled =
      search || venue || city || country || startDate || endDate;

    if (!isAnyFieldFilled) {
      // If no fields are filled, clear the preview results
      setPreviewResults([]);
      onResultsFound(false);
      return;
    }

    if (typingTimeout) clearTimeout(typingTimeout);

    const newTimeout = setTimeout(() => {
      loadPreviewResults();
    }, 500);

    setTypingTimeout(newTimeout);

    return () => clearTimeout(newTimeout);
  }, [search, venue, city, country, startDate, endDate]);

  return (
    <Box
      p={4}
      borderWidth={1}
      borderRadius="lg"
      boxShadow="md"
      position="relative"
    >
      <HStack spacing={4} align="center" wrap="wrap">
        <InputGroup size="sm" maxWidth="200px">
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.500" />
          </InputLeftElement>
          <Input
            placeholder="Search by Title"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </InputGroup>
        <Input
          placeholder="Venue"
          size="sm"
          maxWidth="150px"
          value={venue}
          onChange={(e) => setVenue(e.target.value)}
        />
        <Input
          placeholder="City"
          size="sm"
          maxWidth="150px"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <Input
          placeholder="Country"
          size="sm"
          maxWidth="150px"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />
        <InputGroup size="sm" maxWidth="190px">
          <InputLeftElement pointerEvents="none">
            <CalendarIcon color="gray.500" />
          </InputLeftElement>
          <Input
            type="date"
            placeholder="Start Date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </InputGroup>
        <InputGroup size="sm" maxWidth="190px">
          <InputLeftElement pointerEvents="none">
            <CalendarIcon color="gray.500" />
          </InputLeftElement>
          <Input
            type="date"
            placeholder="End Date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </InputGroup>
      </HStack>

      {/* Scrollable Preview Results */}
      {previewResults.length > 0 && (
        <VStack
          align="start"
          position="absolute"
          top="100%"
          left={0}
          right={0}
          maxHeight="200px"
          overflowY="auto"
          spacing={2}
          bg="white"
          borderWidth="1px"
          borderRadius="md"
          boxShadow="lg"
          zIndex={1}
          p={3}
        >
          {previewResults.map((event) => (
            <ChakraLink
              as={Link}
              to={`/events/${event.id}`}
              key={event.id}
              _hover={{ textDecoration: "none" }}
              width="100%"
            >
              <HStack
                spacing={3}
                p={2}
                borderRadius="md"
                bg="white"
                _hover={{ bg: "gray.100" }}
                align="center"
                borderWidth="1px"
                borderColor="gray.200"
              >
                <Box
                  width="60px"
                  height="60px"
                  overflow="hidden"
                  borderRadius="md"
                  flexShrink={0}
                >
                  <img
                    src={event.thumbnail}
                    alt={event.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>
                <VStack align="start" spacing={1} width="100%">
                  <Text fontWeight="bold" fontSize="md" color="gray.700">
                    {event.title}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    {event.venue}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    {event.city}, {event.country}
                  </Text>
                </VStack>
              </HStack>
            </ChakraLink>
          ))}
        </VStack>
      )}
    </Box>
  );
};
