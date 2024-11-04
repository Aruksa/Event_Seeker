import {
  Input,
  Box,
  InputGroup,
  InputLeftElement,
  HStack,
} from "@chakra-ui/react";
import { CalendarIcon, SearchIcon } from "@chakra-ui/icons";
import { useState, useEffect } from "react";
import axios from "axios";
import { event } from "../types/event";

export const EventsSearch = ({
  onSearch,
  onResultsFound,
}: {
  onSearch: (results: event[]) => void;
  onResultsFound: (found: boolean) => void;
}) => {
  // Individual state variables for each search field
  const [search, setSearch] = useState("");
  const [venue, setVenue] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // State to hold the debounce timeout ID
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  // Effect to handle the debounced search
  useEffect(() => {
    // Clear previous timeout if any
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    // Set a new debounce timeout
    const timeout = setTimeout(() => {
      handleSearch();
    }, 500); // Debounce time of 500 milliseconds

    setDebounceTimeout(timeout);

    return () => {
      clearTimeout(timeout); // Cleanup timeout on unmount or change
    };
  }, [search, venue, city, country, startDate, endDate]); // Dependencies for the effect

  // Function to handle the search API call
  const handleSearch = () => {
    if (!search && !venue && !city && !country && !startDate && !endDate) {
      // If all fields are empty, reset the search results to show all events
      onSearch([]); // or you can trigger a fetch for all events
      onResultsFound(true);
      return;
    }

    axios
      .get(
        `http://localhost:3000/api/events?search=${search}&venue=${venue}&city=${city}&country=${country}&startDate=${startDate}&endDate=${endDate}`
      )
      .then((res) => {
        onSearch(res.data); // Pass results to EventsGrid
        onResultsFound(res.data.length > 0);
      })
      .catch((e) => console.log(e));
  };

  return (
    <Box p={5} borderWidth={1} borderRadius="lg" boxShadow="md">
      <HStack spacing={6} align="center" wrap="wrap">
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
    </Box>
  );
};
