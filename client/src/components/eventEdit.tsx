import { FormEvent, useEffect, useMemo, useState } from "react";
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
  FormControl,
  FormErrorMessage,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { useNavigate, useParams } from "react-router-dom";
import UploadWidget from "./uploadWidget";
import { showToast } from "../services/showToast";

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

  // ERROR STATE FOR EACH FIELD
  const [errors, setErrors] = useState({
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

  useEffect(() => {
    if (!userState.token) {
      navigate("/"); // Redirect to login if not authenticated
    }
    axios
      .get(`http://localhost:3000/api/events/${params.id}`)
      .then((res) => {
        const eventData = res.data.event;

        setNewEvent(eventData);
        console.log(eventData);
        if (eventData) {
          // Ensure that the date formats are correct
          const formattedStartDate = new Date(eventData.startDate)
            .toISOString()
            .slice(0, 16);
          const formattedEndDate = new Date(eventData.endDate)
            .toISOString()
            .slice(0, 16);

          setNewEvent({
            ...eventData,
            startDate: formattedStartDate, // format startDate
            endDate: formattedEndDate, // format endDate
          });
        }
      })

      .catch((error: any) => {
        showToast("error", error.message);
      });
  }, [userState.token]);

  const countryOptions = useMemo(() => countryList().getData(), []);

  const handleImageUpload = (url: string) => {
    setNewEvent({ ...newEvent, thumbnail: url });
    setErrors({ ...errors, thumbnail: "" });
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

  const validateForm = () => {
    const newErrors = {
      title: "",
      venue: "",
      city: "",
      country: "",
      description: "",
      mode: "",
      thumbnail: "",
      startDate: "",
      endDate: "",
    };

    if (newEvent.title.trim() === "") newErrors.title = "Title is required.";
    if (newEvent.venue.trim() === "") newErrors.venue = "Venue is required.";
    if (newEvent.city.trim() === "") newErrors.city = "City is required.";
    if (newEvent.country.trim() === "")
      newErrors.country = "Country is required.";
    if (newEvent.description.trim() === "")
      newErrors.description = "Description is required.";
    if (newEvent.mode.trim() === "") newErrors.mode = "Mode is required.";
    if (newEvent.thumbnail.trim() === "")
      newErrors.thumbnail = "Thumbnail is required.";
    if (newEvent.startDate.trim() === "")
      newErrors.startDate = "Start date is required.";
    if (newEvent.endDate.trim() === "")
      newErrors.endDate = "End date is required.";

    // NEW VALIDATION FOR START AND END DATES
    if (
      newEvent.startDate &&
      newEvent.endDate &&
      new Date(newEvent.startDate) > new Date(newEvent.endDate)
    ) {
      newErrors.endDate = "End date must be after start date.";
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === ""); // Return true if no errors
  };

  const handleUpdateEvent = async (e: any) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const res = await axios.put(
          `http://127.0.0.1:3000/api/events/${params.id}`,
          newEvent,
          { headers: { "x-auth-token": userState.token } }
        );
        eventsDispatch({ type: "updateEvent", payload: res.data });
        showToast("success", "Event updated successfully!", "Success");
        navigate("/");
      } catch (error: any) {
        showToast("error", error.response.data);
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
    setErrors({ ...errors, [e.target.id]: "" });
  };

  const handleModeChange = (selectedOption: any) => {
    setNewEvent({
      ...newEvent,
      mode: selectedOption.value,
    });
    setErrors({ ...errors, mode: "" });
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
              src="https://images.unsplash.com/photo-1635216615320-68906b26443b?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Event Image"
              objectFit="cover"
              borderRadius="0"
              width="100%"
              height="100%"
              // maxHeight="100vh"
            />
          </Box>
          <Box marginLeft={{ base: "0", md: "50px" }}>
            <form onSubmit={handleUpdateEvent}>
              <Stack padding={3} spacing={4}>
                {/* {isErrorVisible && (
                  <Alert borderRadius={10} status="error">
                    <AlertIcon />
                    <AlertTitle>{errorMessage}</AlertTitle>
                  </Alert>
                )} */}
                <Heading>Update Your Event</Heading>

                <FormControl isInvalid={!!errors.title}>
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
                  <FormErrorMessage>{errors.title}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.venue}>
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
                  <FormErrorMessage>{errors.venue}</FormErrorMessage>
                </FormControl>

                <Grid templateColumns="1fr 1fr" gap={3}>
                  <Box>
                    <FormControl isInvalid={!!errors.city}>
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
                      <FormErrorMessage>{errors.city}</FormErrorMessage>
                    </FormControl>
                  </Box>
                  <Box>
                    <FormControl isInvalid={!!errors.country}>
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
                      <FormErrorMessage>{errors.country}</FormErrorMessage>
                    </FormControl>
                  </Box>
                </Grid>

                <Grid templateColumns="1fr 1fr" gap={3}>
                  <Box>
                    <FormControl isInvalid={!!errors.mode}>
                      <label htmlFor="mode">Mode</label>
                      <Select
                        options={modeOptions}
                        value={modeOptions.find(
                          (option) => option.value === newEvent.mode
                        )}
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
                      <FormErrorMessage>{errors.mode}</FormErrorMessage>
                    </FormControl>
                  </Box>
                  <Box>
                    <FormControl isInvalid={!!errors.thumbnail}>
                      <Flex alignItems="center">
                        <label
                          htmlFor="thumbnail"
                          style={{ fontSize: "1.1rem", marginRight: "5px" }}
                        >
                          Thumbnail
                        </label>
                        <IoImageOutline color="gray.500" />
                      </Flex>
                      <FormErrorMessage>{errors.thumbnail}</FormErrorMessage>
                    </FormControl>

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
                    <FormControl isInvalid={!!errors.startDate}>
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
                      <FormErrorMessage>{errors.startDate}</FormErrorMessage>
                    </FormControl>
                  </Box>
                  <Box>
                    <FormControl isInvalid={!!errors.endDate}>
                      <label htmlFor="startDate">Start Date</label>
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
                      <FormErrorMessage>{errors.endDate}</FormErrorMessage>
                    </FormControl>
                  </Box>
                </Grid>

                <FormControl isInvalid={!!errors.description}>
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
                  <FormErrorMessage>{errors.description}</FormErrorMessage>
                </FormControl>
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
