import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { FaRegThumbsUp, FaRegThumbsDown, FaRegStar } from "react-icons/fa";
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
  Button,
  ButtonGroup,
} from "@chakra-ui/react";
import axios from "axios";
import { CiLocationOn } from "react-icons/ci";
import { MdOutlineCalendarToday } from "react-icons/md";
import { useCategoriesContext } from "../contexts/categoriesContext";
import { category } from "../types/category";
import { useUserContext } from "../contexts/userContext";

interface attendees {
  userName: string;
  attendance_type: number;
  review: string;
}

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
    attendees: attendees[];
  };
  categories: number[];
  going: number;
  interested: number;
  not_interested: number;
}

interface userEventScore {
  event_id: number;
  attendance_type: number;
  review: string | null;
}

function EventDetails() {
  const { categories } = useCategoriesContext();
  const params = useParams();

  const { userState } = useUserContext();

  const [event, setEvent] = useState<singleEvent>();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [userEventScore, setUserEventScore] = useState<
    userEventScore | undefined
  >();

  const [firstScore, setFirstScore] = useState(false);

  useEffect(() => {
    const fetchEventData = async () => {
      setLoading(true);
      try {
        const eventResponse = await axios.get(
          `http://localhost:3000/api/events/${params.id}`
        );
        setEvent(eventResponse.data);

        const userScoreResponse = await axios.get(
          `http://localhost:3000/api/events/${params.id}/attds`,
          {
            headers: { "x-auth-token": userState.token },
          }
        );

        setUserEventScore(userScoreResponse.data);
        if (userScoreResponse.data?.attendance_type === undefined) {
          setFirstScore(true);
        } else {
          setFirstScore(false);
        }
      } catch (error) {
        console.error(error);
        // setError("Failed to load event data");
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [userState.token]);

  const handleScoreSubmit = async (scoreType: string) => {
    setLoading(true);
    let attendanceType;

    // Map scoreType to attendance_type values
    if (scoreType === "going") attendanceType = 5;
    else if (scoreType === "interested") attendanceType = 3;
    else if (scoreType === "not_interested") attendanceType = 0;

    try {
      const url = `http://localhost:3000/api/events/${params.id}/attds`;
      const method = firstScore ? "post" : "put";

      const response = await axios({
        method,
        url,
        data: { attendance_type: attendanceType },
        headers: { "x-auth-token": userState.token },
      });

      setUserEventScore(response.data); // Update local user score state based on response
      // Optionally update the event data if it changes
      // setEvent((prevEvent) => ({ ...prevEvent, going: response.data.going }));
      // console.log("USER EVENT SCORE",response.data);
    } catch (error) {
      console.error("Failed to update score", error);
      setError("Failed to update score. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
                fontSize={{ base: "2xl", sm: "3xl", lg: "4xl" }}
              >
                {event?.event.title}
              </Heading>
              <Flex
                align="center"
                fontWeight={300}
                fontSize={"2xl"}
                paddingTop={1}
              >
                <CiLocationOn style={{ marginRight: "0.5rem" }} />{" "}
                {/* Adds slight space */}
                <Text as="span">
                  {event?.event.venue}, {event?.event.city},{" "}
                  {event?.event.country}
                </Text>
              </Flex>
              <Box bg="white" p={6} borderRadius="xl" boxShadow="sm">
                <Flex
                  gap={4}
                  direction={{ base: "column", sm: "row" }}
                  alignItems="center"
                  justifyContent="flex-start" // Align items to the left
                  width="100%"
                >
                  <Button
                    onClick={() => handleScoreSubmit("going")}
                    isLoading={loading}
                    p={2}
                    fontSize="sm"
                    border="1px solid"
                    borderColor="green.600"
                    color="green.600"
                    bg="gray.50"
                    _hover={{
                      bg: "green.600",
                      color: "white",
                      transform: "translateY(-2px)",
                    }}
                    transition="all 0.2s"
                    leftIcon={<FaRegThumbsUp />} // Thumbs up icon
                  >
                    <Text fontWeight="semibold">{event?.going}</Text>
                    <Text fontSize="xs" fontWeight="medium" ml={1}>
                      Going
                    </Text>
                  </Button>

                  <Button
                    onClick={() => handleScoreSubmit("not_interested")}
                    isLoading={loading}
                    p={2}
                    fontSize="sm"
                    border="1px solid"
                    borderColor="red.600"
                    color="red.600"
                    bg="gray.50"
                    _hover={{
                      bg: "red.600",
                      color: "white",
                      transform: "translateY(-2px)",
                    }}
                    transition="all 0.2s"
                    leftIcon={<FaRegThumbsDown />} // Thumbs down icon
                  >
                    <Text fontWeight="semibold">{event?.not_interested}</Text>
                    <Text fontSize="xs" fontWeight="medium" ml={1}>
                      Not Going
                    </Text>
                  </Button>

                  <Button
                    onClick={() => handleScoreSubmit("interested")}
                    isLoading={loading}
                    p={2}
                    fontSize="sm"
                    border="1px solid"
                    borderColor="blue.600"
                    color="blue.600"
                    bg="gray.50"
                    _hover={{
                      bg: "blue.600",
                      color: "white",
                      transform: "translateY(-2px)",
                    }}
                    transition="all 0.2s"
                    leftIcon={<FaRegStar />} // Star icon for Interested
                  >
                    <Text fontWeight="semibold">{event?.interested}</Text>
                    <Text fontSize="xs" fontWeight="medium" ml={1}>
                      Interested
                    </Text>
                  </Button>
                </Flex>
              </Box>
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
                      End:{" "}
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
          <Box mt={10}>
            <Text
              fontSize={{ base: "16px", lg: "18px" }}
              fontWeight="500"
              textTransform="uppercase"
              mb={4}
            >
              Attendee Reviews
            </Text>

            {event?.event.attendees?.filter((attendee) => attendee.review)
              .length ? (
              <List spacing={3}>
                {event.event.attendees
                  .filter((attendee) => attendee.review) // Only include attendees with a review
                  .map((attendee, index) => (
                    <ListItem
                      key={index}
                      border="1px solid"
                      borderRadius="md"
                      p={4}
                    >
                      <Text fontWeight="bold">{attendee.userName}</Text>
                      <Text fontSize="sm" color="gray.600">
                        {attendee.review}
                      </Text>
                    </ListItem>
                  ))}
              </List>
            ) : (
              <Text fontSize="sm" color="gray.500">
                No attendee reviews available
              </Text>
            )}
          </Box>
        </SimpleGrid>
      </Container>
    </>
  );
}

export default EventDetails;
