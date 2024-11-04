import {
  Box,
  Card,
  CardBody,
  Center,
  Heading,
  Image,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { event } from "../types/event";

import { useState } from "react";
interface Props {
  event: event;
}

function EventCard({ event }: Props) {
  const [loading, setLoading] = useState(true);
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
        <Text>{event.avg_attendance}</Text>
      </CardBody>
    </Card>
  );
}

export default EventCard;
