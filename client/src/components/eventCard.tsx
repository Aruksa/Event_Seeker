import {
  Box,
  Card,
  CardBody,
  Center,
  Heading,
  HStack,
  Icon,
  Image,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { event } from "../types/event";
import { MdOutlineStar } from "react-icons/md";
import { FaVideo, FaLocationDot, FaVideoSlash } from "react-icons/fa6";

import { useState } from "react";

interface Props {
  event: event;
}

function EventCard({ event }: Props) {
  const [loading, setLoading] = useState(true);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-GB", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      timeZoneName: "short",
    }).format(date);
  };

  return (
    <Card
      overflow="hidden"
      borderRadius="lg"
      width="350px"
      height="385px"
      border="none"
      boxShadow="none"
    >
      {loading && (
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Spinner />
        </Box>
      )}

      <Box position="relative" width="100%" height="200px">
        {event.mode && (
          <Box
            position="absolute"
            top="8px"
            left="8px"
            p="2"
            color="white"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {event.mode === "Online" ? (
              <Icon as={FaVideo} boxSize={5} />
            ) : event.mode === "Physical" ? (
              <Icon as={FaLocationDot} boxSize={5} />
            ) : (
              <HStack spacing={1}>
                <Icon as={FaVideo} boxSize={5} />
                <Icon as={FaLocationDot} boxSize={4} />
              </HStack>
            )}
          </Box>
        )}

        <Image
          src={event.thumbnail}
          width="100%" // Set width to fill the card
          height="200px" // Adjust height to make it rectangular
          objectFit="cover" // Maintain aspect ratio while filling the space
          alt={event.title}
          borderRadius="10px 10px 10px 10px" // Rounded top corners only
          onLoad={() => setLoading(false)}
          onError={() => setLoading(false)}
          display={loading ? "none" : "block"}
        />
      </Box>
      <CardBody>
        <Heading fontSize="lg">{event.title}</Heading>
        <HStack spacing={1} align="center">
          <Icon as={MdOutlineStar} boxSize={6} color="black" mt={0.5} ml={-1} />
          <Text fontSize="xl" color="gray.600">
            {event.avg_attendance === 0 || event.avg_attendance === null
              ? "No Rating"
              : `${event.avg_attendance}`}
          </Text>
        </HStack>
        <HStack spacing={2} align="center">
          <Icon as={FaLocationDot} color="gray.500" />
          <Text fontSize="sm" color="gray.600">
            {`${event.venue}, ${event.city}, ${event.country}`}
          </Text>
        </HStack>

        <Text>Start: {formatDate(event.startDate)}</Text>
        <Text>End: {formatDate(event.endDate)}</Text>
      </CardBody>
    </Card>
  );
}

export default EventCard;
