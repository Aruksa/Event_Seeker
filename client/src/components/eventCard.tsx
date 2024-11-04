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
      height="300px"
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
      <CardBody>
        <Heading fontSize="lg">{event.title}</Heading>
        <HStack spacing={1} align="center">
          <Icon as={MdOutlineStar} boxSize={6} color="black" mt={0.5} />
          <Text fontSize="xl" color="gray.600">
            {event.avg_attendance === 0
              ? "No Rating"
              : `${event.avg_attendance}`}
          </Text>
        </HStack>
        <Text>Start: {formatDate(event.startDate)}</Text>
        {/* <Text>End: {formatDate(event.endDate)}</Text> */}
      </CardBody>
    </Card>
  );
}

export default EventCard;
