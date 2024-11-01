import { FormEvent, useMemo, useState } from "react";
import { useCategoriesContext } from "../contexts/categoriesContext";
import { useEventsContext } from "../contexts/eventsContext";
import { useUserContext } from "../contexts/userContext";
import axios from "axios";
import Select from "react-select";
import countryList from "react-select-country-list";
import { IoImageOutline } from "react-icons/io5";

import {
  Alert,
  AlertIcon,
  AlertTitle,
  Button,
  Grid,
  Image,
  Input,
  Stack,
  Box,
  Textarea,
  IconButton,
  Flex,
  Heading,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { category } from "../types/category";
import { useNavigate, useParams } from "react-router-dom";
import UploadWidget from "./uploadWidget";

const EventEdit = () => {
  const navigate = useNavigate();
  const { userState } = useUserContext();

  const { eventsState, eventsDispatch } = useEventsContext();

  const params = useParams();

  const [newEvent, setNewEvent] = useState({
    title: "",
    venue: "",
    city: "",
    country: "",
    description: "",
    mode: "",
    thumbnail: "",
    startDate: "",
    endDate: "",
  });

  const countryOptions = useMemo(() => countryList().getData(), []);

  const handleImageUpload = (url: string) => {
    setNewEvent({ ...newEvent, thumbnail: url });
  };

  const removeImage = () => {
    setNewEvent({ ...newEvent, thumbnail: "" });
  };
  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toISOString().slice(0, 16); //'YYYY-MM-DDTHH:MM'
  };

  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  const [isErrorVisible, setIsErrorVisible] = useState(false); // State for controlling error visibility

  const handleCountryChange = (selectedCountry: any) => {
    setNewEvent({
      ...newEvent,
      country: selectedCountry.value,
    });
  };
  const modeOptions = [
    { value: "Online", label: "Online" },
    { value: "Physical", label: "Physical" },
    { value: "Hybrid", label: "Hybrid" },
  ];

  const isFormValid =
    newEvent.title.trim() !== "" &&
    newEvent.venue.trim() !== "" &&
    newEvent.city.trim() !== "" &&
    newEvent.country.trim() !== "" &&
    newEvent.description.trim() !== "" &&
    newEvent.mode.trim() !== "" &&
    newEvent.thumbnail.trim() !== "" &&
    newEvent.startDate.trim() !== "" &&
    newEvent.endDate.trim() !== "";

  const handleUpdateEvent = async (e: any) => {
    e.preventDefault();
    if (isFormValid) {
      try {
        const res = await axios.put(
          `http://127.0.0.1:3000/api/events/${params.id}`,
          newEvent,
          { headers: { "x-auth-token": userState.token } }
        );
        eventsDispatch({ type: "updateEvent", payload: res.data });
        navigate("/");
      } catch (error) {
        console.error("Error updating event:", error);
      }
    } else {
      setErrorMessage("Please fill in all fields before submitting!");
      setIsErrorVisible(true);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setNewEvent({ ...newEvent, [e.target.id]: e.target.value });
    if (isErrorVisible) {
      setErrorMessage(""); // Clear error message when user starts typing
      setIsErrorVisible(false); // Hide error popup when typing
    }
  };

  const handleModeChange = (selectedOption: any) => {
    setNewEvent({
      ...newEvent,
      mode: selectedOption.value, // Update mode in newEvent
    });
  };
  // console.log(newEvent);

  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = () => {};

  const uploadImage = async (e: FormEvent) => {
    e.preventDefault;
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="stretch"
        backgroundColor={"#fcfcfb"}
        flex="1"
      >
        <Grid
          templateColumns={{ base: "1fr", md: "1fr 1fr" }}
          gap={12}
          alignItems="stretch"
          maxWidth="80%"
          height="100%"
        >
          <Box flex="1" position="relative">
            <Image
              src="https://images.unsplash.com/photo-1607653150149-526b2744ca60?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Event Image"
              objectFit="cover"
              borderRadius="0"
              width="100%"
              height="100%"
              // maxHeight="100vh"
            />
            {newEvent.thumbnail && (
              <Box
                position="absolute"
                bottom="10px"
                left="10px"
                display="flex"
                alignItems="center"
              >
                <Image
                  src={
                    "https://cdn-icons-png.flaticon.com/512/3769/3769151.png"
                  }
                  alt="Placeholder"
                  borderRadius="md"
                  maxHeight="200px"
                  objectFit="cover"
                  marginRight="10px" // Add some space between the image and the message box
                />
                <Box
                  backgroundColor="white"
                  borderRadius="md"
                  padding="10px"
                  boxShadow="md"
                  maxWidth="250px" // You can adjust this width as needed
                >
                  Great Job! The event looks great!
                </Box>
              </Box>
            )}
          </Box>
          <Box marginLeft={{ base: "0", md: "50px" }}>
            <form onSubmit={handleUpdateEvent}>
              <Stack padding={3} spacing={4}>
                {isErrorVisible && (
                  <Alert borderRadius={10} status="error">
                    <AlertIcon />
                    <AlertTitle>{errorMessage}</AlertTitle>
                  </Alert>
                )}
                <Heading>Update Your Event</Heading>

                <label htmlFor="title" style={{ fontSize: "1.1rem" }}>
                  Title
                </label>
                <Input
                  id="title"
                  type="text"
                  variant="outline"
                  value={newEvent.title}
                  onChange={handleChange}
                  backgroundColor="white"
                  boxShadow="md"
                />

                <label htmlFor="venue">Venue</label>
                <Input
                  id="venue"
                  type="text"
                  variant="outline"
                  value={newEvent.venue}
                  placeholder="Insert venue..."
                  onChange={handleChange}
                  backgroundColor="white"
                  boxShadow="md"
                />

                <Grid templateColumns="1fr 1fr" gap={3}>
                  <Box>
                    <label htmlFor="city">City</label>
                    <Input
                      id="city"
                      type="text"
                      variant="outline"
                      value={newEvent.city}
                      placeholder="City"
                      onChange={handleChange}
                      backgroundColor="white"
                      boxShadow="md"
                    />
                  </Box>
                  <Box>
                    <label>Country</label>
                    <Select
                      options={countryOptions}
                      value={countryOptions.find(
                        (option) => option.value === newEvent.country
                      )}
                      onChange={handleCountryChange}
                      placeholder="Country"
                      styles={{
                        control: (base) => ({
                          ...base,
                          backgroundColor: "white",
                          borderColor: "#CBD5E0",
                          minHeight: "40px",
                          boxShadow: "md",
                        }),
                      }}
                    />
                  </Box>
                </Grid>

                <Grid templateColumns="1fr 1fr" gap={3}>
                  <Box>
                    <label htmlFor="mode">Mode</label>
                    <Select
                      options={modeOptions}
                      onChange={handleModeChange}
                      placeholder="Select Mode"
                      styles={{
                        control: (base) => ({
                          ...base,
                          backgroundColor: "white",
                          borderColor: "#CBD5E0",
                          minHeight: "40px",
                          boxShadow: "md",
                        }),
                      }}
                    />
                  </Box>
                  <Box>
                    <Flex alignItems="center">
                      <label
                        htmlFor="thumbnail"
                        style={{ fontSize: "1.1rem", marginRight: "5px" }}
                      >
                        Thumbnail
                      </label>
                      <IoImageOutline color="gray.500" />
                    </Flex>
                    <UploadWidget onUpload={handleImageUpload} />
                    {newEvent.thumbnail && (
                      <Box position="relative" mt={4}>
                        <Image
                          src={newEvent.thumbnail}
                          alt="Preview"
                          width="100px" // Ensure it takes the full width of the container
                          height="100px" // Ensure it takes the full height of the container
                          objectFit="cover"
                        />
                        <IconButton
                          aria-label="Remove image"
                          icon={<CloseIcon />}
                          onClick={removeImage}
                          position="absolute"
                          top="4px"
                          right="4px"
                          colorScheme="red"
                          size="sm"
                        />
                      </Box>
                    )}
                  </Box>
                </Grid>

                <Grid templateColumns="1fr 1fr" gap={3}>
                  <Box>
                    <label htmlFor="startDate">Start Date</label>
                    <Input
                      id="startDate"
                      type="datetime-local"
                      variant="outline"
                      value={newEvent.startDate}
                      min={getCurrentDateTime()}
                      onChange={handleChange}
                      boxShadow="md"
                    />
                  </Box>
                  <Box>
                    <label htmlFor="endDate">End Date</label>
                    <Input
                      id="endDate"
                      type="datetime-local"
                      variant="outline"
                      value={newEvent.endDate}
                      min={getCurrentDateTime()}
                      onChange={handleChange}
                      boxShadow="md"
                    />
                  </Box>
                </Grid>

                <label htmlFor="description">Description</label>
                <Textarea
                  id="description"
                  variant="outline"
                  value={newEvent.description}
                  placeholder="Description..."
                  onChange={handleChange}
                  backgroundColor="white"
                  boxShadow="md"
                />
                <Button
                  type="submit"
                  colorScheme=""
                  width="100%"
                  bg="#e83e6b"
                  color={"white"}
                  _hover={{
                    bg: "#B91C48",
                  }}
                >
                  Update
                </Button>
              </Stack>
            </form>
          </Box>
        </Grid>
      </Box>
    </>
  );
};

export default EventEdit;