import {
  Input,
  Button,
  Box,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  HStack,
  IconButton,
} from "@chakra-ui/react";
import { CalendarIcon, SearchIcon } from "@chakra-ui/icons";
import { useState } from "react";

export const EventsSearch = () => {
  const [searchTitle, setSearchTitle] = useState("");
  const [city, setCity] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  return (
    <Box p={4} borderWidth={1} borderRadius="lg" boxShadow="md">
      <HStack spacing={4} align="center">
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

        {/* City Input */}
        <Input
          placeholder="City"
          size="sm"
          maxWidth="150px"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />

        {/* Location Input */}
        <Input
          placeholder="Location"
          size="sm"
          maxWidth="150px"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        {/* Start Date */}
        <InputGroup size="sm" maxWidth="130px">
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
        <InputGroup size="sm" maxWidth="130px">
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
          onClick={() => /* handle search logic */ null}
        />
      </HStack>
    </Box>
  );
};
