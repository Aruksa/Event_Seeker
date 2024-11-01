import {
  Input,
  Button,
  Box,
  InputGroup,
  InputLeftElement,
  HStack,
  IconButton,
} from "@chakra-ui/react";
import { CalendarIcon, SearchIcon } from "@chakra-ui/icons";
import { useState } from "react";
import axios from "axios"; // Import axios for API calls

export const EventsSearch = () => {
  const [searchTitle, setSearchTitle] = useState("");
  const [city, setCity] = useState("");
  const [venue, setVenue] = useState(""); // Changed location to venue
  const [country, setCountry] = useState(""); // Added state for country
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSearch = async () => {
    try {
      // Construct query parameters
      const params = new URLSearchParams({
        search: searchTitle,
        city,
        venue,
        country,
        startDate,
        endDate,
      }).toString();

      // Fetch events from the API
      const response = await axios.get(`/api/events?${params}`);
      console.log(response.data); // Process or display the fetched events
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  return (
    <Box p={4} borderWidth={1} borderRadius="lg" boxShadow="md">
      <HStack spacing={4} align="center" wrap="wrap">
        {/* Main Search Input */}
        <InputGroup size="sm" maxWidth="200px">
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.500" />
          </InputLeftElement>
          <Input
            placeholder="Search by Title"
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
          />
        </InputGroup>
        <Input
          placeholder="Venue"
          size="sm"
          maxWidth="150px"
          value={venue}
          onChange={(e) => setVenue(e.target.value)} // Updated state
        />
        <Input
          placeholder="City"
          size="sm"
          maxWidth="150px"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        {/* Country Input */}
        <Input
          placeholder="Country"
          size="sm"
          maxWidth="150px"
          value={country} // Bound to the country state
          onChange={(e) => setCountry(e.target.value)} // Updated state
        />
        {/* Start Date */}
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
        {/* End Date */}
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
        {/* Small Search Icon Button */}
        <IconButton
          aria-label="Search Events"
          icon={<SearchIcon />}
          colorScheme="teal"
          size="sm"
          onClick={handleSearch} // Call the handleSearch function on click
        />
      </HStack>
    </Box>
  );
};
