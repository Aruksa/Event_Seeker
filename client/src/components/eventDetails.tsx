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
  Button,
  ButtonGroup,
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

            <Box bg="white" p={6} borderRadius="xl" boxShadow="sm">
              <Flex
                gap={4}
                direction={{ base: "column", sm: "row" }}
                alignItems="center" // Center items vertically
                justifyContent="center" // Use Flex to control direction
                width="100%"
              >
                <Button
                  p={2} // Reduce padding for smaller button
                  fontSize="sm" // Smaller font size
                  border="1px solid" // Reduce border width
                  borderColor="green.600"
                  color="green.600"
                  bg="gray.50"
                  _hover={{
                    bg: "green.600",
                    color: "white",
                    transform: "translateY(-2px)",
                  }}
                  transition="all 0.2s"
                >
                  <Text fontWeight="semibold">{event?.going}</Text>
                  <Text fontSize="xs" fontWeight="medium" marginLeft={1}>
                    Going
                  </Text>{" "}
                  {/* Smaller text size */}
                </Button>

                <Button
                  p={2} // Reduce padding for smaller button
                  fontSize="sm" // Smaller font size
                  border="1px solid" // Reduce border width
                  borderColor="red.600"
                  color="red.600"
                  bg="gray.50"
                  _hover={{
                    bg: "red.600",
                    color: "white",
                    transform: "translateY(-2px)",
                  }}
                  transition="all 0.2s"
                >
                  <Text fontWeight="semibold">{event?.not_interested} </Text>
                  <Text fontSize="xs" fontWeight="medium" marginLeft={1}>
                    Not Going
                  </Text>{" "}
                  {/* Smaller text size */}
                </Button>

                <Button
                  p={2} // Reduce padding for smaller button
                  fontSize="sm" // Smaller font size
                  border="1px solid" // Reduce border width
                  borderColor="blue.600"
                  color="blue.600"
                  bg="gray.50"
                  _hover={{
                    bg: "blue.600",
                    color: "white",
                    transform: "translateY(-2px)",
                  }}
                  transition="all 0.2s"
                >
                  <Text fontWeight="semibold">{event?.interested}</Text>
                  <Text fontSize="xs" fontWeight="medium" marginLeft={1}>
                    Interested
                  </Text>{" "}
                  {/* Smaller text size */}
                </Button>
              </Flex>
            </Box>
          </Stack>
        </SimpleGrid>
      </Container>
    </>
  );
}

export default EventDetails;
