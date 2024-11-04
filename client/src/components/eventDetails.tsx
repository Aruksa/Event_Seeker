import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { FaThumbsUp, FaThumbsDown, FaHeart } from "react-icons/fa";
import { MdOutlineStar } from "react-icons/md";

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
  IconButton,
  HStack,
  Icon,
  Tooltip,
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
  avg_attendance: number;
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

  const userEventScoreRef = useRef<userEventScore | undefined>(undefined);

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

        // setUserEventScore(userScoreResponse.data);
        userEventScoreRef.current = userScoreResponse.data;
        console.log("VALUE", userEventScoreRef.current);

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
  }, [userState.token, userEventScore]);

  const handleScoreSubmit = async (scoreType: string) => {
    setLoading(true);
    let attendanceType;

    // Map scoreType to attendance_type values
    if (scoreType === "going") attendanceType = 5;
    else if (scoreType === "interested") attendanceType = 3;
    else if (scoreType === "not_interested") attendanceType = 1;

    try {
      const url = `http://localhost:3000/api/events/${params.id}/attds`;
      const method = firstScore ? "post" : "put";

      const response = await axios({
        method,
        url,
        data: { attendance_type: attendanceType },
        headers: { "x-auth-token": userState.token },
      });

      setUserEventScore(response.data);
    } catch (error) {
      console.error("Failed to update score", error);
      setError("Failed to update score. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // console.log(event);

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

  const isUserVoted = (type: number) => {
    if (userEventScoreRef.current?.attendance_type === type) {
      return true;
    }
    return userEventScore?.attendance_type === type;
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
              src={event?.event.thumbnail}
              fit={"cover"}
              align={"center"}
              w={"100%"}
              h={{ base: "100%", sm: "400px", lg: "500px" }}
            />
          </Flex>
          <Stack
            align="start"
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
              <Box
                display="flex"
                alignItems="center"
                borderRadius="md"
                maxWidth="150px"
                paddingTop={3}
                paddingLeft={1}
              >
                <HStack spacing={1} align="center">
                  <Icon as={MdOutlineStar} boxSize={6} color="black" mt={0.5} />
                  <Text fontSize="xl" color="gray.600"></Text>
                </HStack>
                <Text fontWeight="bold" fontSize="xl" color="blue.800">
                  {event?.avg_attendance}
                </Text>
              </Box>
              <Box bg="white" paddingTop={3} borderRadius="xl" boxShadow="sm">
                <Flex
                  gap={4}
                  direction={{ base: "column", sm: "row" }}
                  // alignItems="center"
                  justifyContent="flex-start"
                  width="100%"
                >
                  <HStack spacing={2} align="center">
                    <Tooltip
                      label="Going"
                      aria-label="Going tooltip"
                      placement="top"
                    >
                      <IconButton
                        aria-label="Going"
                        icon={<FaThumbsUp />}
                        onClick={() => handleScoreSubmit("going")}
                        isLoading={loading}
                        colorScheme={isUserVoted(5) ? "green" : "gray"}
                        variant={isUserVoted(5) ? "solid" : "outline"}
                      />
                    </Tooltip>
                    <Text fontWeight="semibold">{event?.going}</Text>
                  </HStack>

                  <HStack spacing={2} align="center">
                    <Tooltip
                      label="Not Going"
                      aria-label="Not Going tooltip"
                      placement="top"
                    >
                      <IconButton
                        aria-label="Not Going"
                        icon={<FaThumbsDown />}
                        onClick={() => handleScoreSubmit("not_interested")}
                        isLoading={loading}
                        colorScheme={isUserVoted(1) ? "red" : "gray"}
                        variant={isUserVoted(1) ? "solid" : "outline"}
                      />
                    </Tooltip>
                    <Text fontWeight="semibold">{event?.not_interested}</Text>
                  </HStack>

                  <HStack spacing={2} align="center">
                    <Tooltip
                      label="Interested"
                      aria-label="Interested tooltip"
                      placement="top"
                    >
                      <IconButton
                        aria-label="Interested"
                        icon={<FaHeart />}
                        onClick={() => handleScoreSubmit("interested")}
                        isLoading={loading}
                        colorScheme={isUserVoted(3) ? "blue" : "gray"}
                        variant={isUserVoted(3) ? "solid" : "outline"}
                      />
                    </Tooltip>
                    <Text fontWeight="semibold">{event?.interested}</Text>
                  </HStack>
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
          {/* <Box mt={10}>
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
          </Box> */}
        </SimpleGrid>
      </Container>
    </>
  );
}

export default EventDetails;
