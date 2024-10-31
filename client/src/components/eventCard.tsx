import { Card, CardBody, Center, Heading, Image, Text } from "@chakra-ui/react";
import { event } from "../types/event";

interface Props {
  event: event;
}

function EventCard({ event }: Props) {
  // console.log(event);

  return (
    <Card
      overflow="hidden"
      borderRadius="lg"
      width="350px"
      height="300px"
      border="none"
      boxShadow="none"
    >
      {" "}
      {/* Added fixed height */}
      <Image
        src={event.thumbnail}
        width="100%" // Set width to fill the card
        height="200px" // Adjust height to make it rectangular
        objectFit="cover" // Maintain aspect ratio while filling the space
        alt={event.title}
        borderRadius="10px 10px 10px 10px" // Rounded top corners only
      />
      <CardBody>
        <Heading fontSize="lg">{event.title}</Heading>
        <Text>{event.avg_attendance}</Text>
      </CardBody>
    </Card>
  );
}

export default EventCard;
