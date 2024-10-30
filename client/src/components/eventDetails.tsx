import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Container,
  Stack,
  Text,
  Image,
  Flex,
  VStack,
  Heading,
  SimpleGrid,
  StackDivider,
  List,
  ListItem,
  Alert,
  AlertIcon,
  AlertTitle,
  Badge,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import axios from "axios";
import { CiLocationOn } from "react-icons/ci";
import { MdOutlineCalendarToday } from "react-icons/md";
import { useCategoriesContext } from "../contexts/categoriesContext";
import { category } from "../types/category";

export interface singleEvent {
  event: {
    id: number;
    title: string;
    venue: string;
    city: string;
    country: string;
    description: string;
    mode: string;
    thumbnail: string;
    startDate: string;
    endDate: string;
    avg_attendance: number;
  };
  categories: number[];
  going: number;
  interested: number;
  not_interested: number;
}

function EventDetails() {
  const { categories } = useCategoriesContext();
  const params = useParams();

  const [event, setEvent] = useState<singleEvent>();
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/events/${params.id}`)
      .then((res) => setEvent(res.data))
      .catch((error: any) => {
        console.error(error);
        setError("Failed to load event data");
      });
  }, []);

  console.log(event);
  // console.log(categories);

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
    <>
      {error && (
        <Alert borderRadius={10} status="error">
          <AlertIcon />
          <AlertTitle>{error}</AlertTitle>
        </Alert>
      )}
      <Container maxW={"7xl"}>
        <SimpleGrid
          columns={{ base: 1, lg: 2 }}
          spacing={{ base: 8, md: 10 }}
          py={{ base: 18, md: 24 }}
        >
          <Flex>
            <Image
              rounded={"md"}
              alt={"event image"}
              src={event?.event.thumbnail} // Assumes event thumbnail image is available
              fit={"cover"}
              align={"center"}
              w={"100%"}
              h={{ base: "100%", sm: "400px", lg: "500px" }}
            />
          </Flex>
          <Stack
          // spacing={{ base: 6, md: 10 }}
          >
            <Box as={"header"}>
              <Heading
                lineHeight={1.1}
                fontWeight={600}
                fontSize={{ base: "2xl", sm: "4xl", lg: "5xl" }}
              >
                {event?.event.title}
              </Heading>
              <Flex align="center" fontWeight={300} fontSize={"2xl"}>
                <CiLocationOn style={{ marginRight: "0.5rem" }} />{" "}
                {/* Adds slight space */}
                <Text as="span">
                  {event?.event.venue}, {event?.event.city},{" "}
                  {event?.event.country}
                </Text>
              </Flex>
            </Box>

            <Stack
              // spacing={{ base: 4, sm: 6 }}
              direction={"column"}
              divider={<StackDivider borderColor="gray.200" />}
            >
              <VStack spacing={{ base: 4, sm: 6 }} align="start">
                <Box>
                  <Flex align="center" fontWeight={300} fontSize={"2xl"} mt={2}>
                    <MdOutlineCalendarToday style={{ marginRight: "0.5rem" }} />{" "}
                    {/* Adds slight space */}
                    <Text as="span">
                      Start:{" "}
                      {event?.event.startDate
                        ? formatDate(event.event.startDate)
                        : ""}
                    </Text>
                  </Flex>
                  <Flex align="center" fontWeight={300} fontSize={"2xl"} mt={2}>
                    <MdOutlineCalendarToday style={{ marginRight: "0.5rem" }} />{" "}
                    {/* Adds slight space */}
                    <Text as="span">
                      Start:{" "}
                      {event?.event.endDate
                        ? formatDate(event.event.endDate)
                        : ""}
                    </Text>
                  </Flex>
                </Box>
                <Text fontSize={"lg"}>{event?.event.description}</Text>
              </VStack>
              <Box>
                <Text
                  fontSize={{ base: "16px", lg: "18px" }}
                  fontWeight={"500"}
                  textTransform={"uppercase"}
                  mb={"4"}
                >
                  Categories
                </Text>
                <Wrap spacing={2}>
                  {categories
                    .filter((category: category) =>
                      event?.categories.includes(category.id)
                    )
                    .map((category: category) => (
                      <WrapItem key={category.id}>
                        <Badge
                          colorScheme="blue"
                          fontSize="sm"
                          px={3}
                          py={1}
                          borderRadius="full"
                        >
                          {category.name}
                        </Badge>
                      </WrapItem>
                    ))}
                </Wrap>
              </Box>
            </Stack>
          </Stack>
        </SimpleGrid>
      </Container>
    </>
  );
}

export default EventDetails;
