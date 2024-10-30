import { Card, CardBody, Heading, Image, Text } from "@chakra-ui/react";
import { event } from "../types/event";

interface Props {
  event: event;
}

function EventCard({ event }: Props) {
  return (
    <Card overflow="hidden">
      <Image
        src={event.thumbnail}
        boxSize="200px" // Set a fixed size for the image
        objectFit="cover" // Maintain aspect ratio while filling the box
        borderRadius="10px 10px 10px 10px"
        alt={event.title}
      />
      <CardBody>
        <Heading fontSize="2xl">{event.title}</Heading>
        <Text>{event.mode}</Text>
      </CardBody>
    </Card>
  );
}

export default EventCard;
