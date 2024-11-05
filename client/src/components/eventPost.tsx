import { FormEvent, useMemo, useState } from "react";
import { useCategoriesContext } from "../contexts/categoriesContext";
import { useEventsContext } from "../contexts/eventsContext";
import { useUserContext } from "../contexts/userContext";
import axios from "axios";
import Select from "react-select";
import countryList from "react-select-country-list";
import { IoImageOutline } from "react-icons/io5";

import {
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
  FormErrorMessage,
  FormControl,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import UploadWidget from "./uploadWidget";
import { showToast } from "../services/showToast";

const EventPost = () => {
  const navigate = useNavigate();
  const { userState } = useUserContext();
  const { categories } = useCategoriesContext();
  const { eventsState, eventsDispatch } = useEventsContext();

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
    categories: "",
  });

  // FORM VALIDATION FUNCTION TO UPDATE ERROR STATE
  const validateForm = () => {
    const newErrors: typeof errors = {
      title: "",
      venue: "",
      city: "",
      country: "",
      description: "",
      mode: "",
      thumbnail: "",
      startDate: "",
      endDate: "",
      categories: "",
    };

    let isValid = true;

    // CHECK EACH FIELD AND ADD ERROR MESSAGES IF NECESSARY
    if (!newEvent.title.trim()) {
      newErrors.title = "Title cannot be empty";
      isValid = false;
    }
    if (!newEvent.venue.trim()) {
      newErrors.venue = "Venue cannot be empty";
      isValid = false;
    }
    if (!newEvent.city.trim()) {
      newErrors.city = "City cannot be empty";
      isValid = false;
    }
    if (!newEvent.country) {
      newErrors.country = "Country cannot be empty";
      isValid = false;
    }
    if (!newEvent.description.trim()) {
      newErrors.description = "Description cannot be empty";
      isValid = false;
    }
    if (!newEvent.mode) {
      newErrors.mode = "Mode cannot be empty";
      isValid = false;
    }
    if (!newEvent.thumbnail) {
      newErrors.thumbnail = "Thumbnail cannot be empty";
      isValid = false;
    }
    if (!newEvent.startDate) {
      newErrors.startDate = "Start Date cannot be empty";
      isValid = false;
    }
    if (!newEvent.endDate) {
      newErrors.endDate = "End Date cannot be empty";
      isValid = false;
    } else if (newEvent.startDate && newEvent.endDate < newEvent.startDate) {
      newErrors.endDate = "End date cannot be before start date";
      isValid = false;
    }
    if (newEvent.categories.length === 0) {
      newErrors.categories = "At least one category must be selected";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    categories: [],
  });

  const countryOptions = useMemo(() => countryList().getData(), []);

  const handleImageUpload = (url: string) => {
    setNewEvent({ ...newEvent, thumbnail: url });
    setIsErrorVisible(false);
  };

  const removeImage = () => {
    setNewEvent({ ...newEvent, thumbnail: "" });
  };
  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toISOString().slice(0, 16); //'YYYY-MM-DDTHH:MM'
  };

  const [isErrorVisible, setIsErrorVisible] = useState(false); // State for controlling error visibility

  const categoryOptions = categories.map((category) => ({
    value: category.id,
    label: category.name,
  }));

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

  const handleAddEvent = (e: FormEvent) => {
    e.preventDefault();

    // Only proceed with submission if the form is valid
    if (validateForm()) {
      axios
        .post("http://127.0.0.1:3000/api/events", newEvent, {
          headers: { "x-auth-token": userState.token },
        })
        .then((res) => {
          setNewEvent(res.data);
          eventsDispatch({
            type: "getEvents",
            payload: [...eventsState.events, res.data],
          });
          setIsErrorVisible(false); // Hide error popup
          setErrors({
            title: "",
            venue: "",
            city: "",
            country: "",
            description: "",
            mode: "",
            thumbnail: "",
            startDate: "",
            endDate: "",
            categories: "",
          }); // RESET ERRORS ON SUCCESS
          navigate("/");
        })
        .catch((error: any) => {
          showToast("error", error.message, "Error");
        })
        .finally(() => {
          showToast("success", "Event posted successfully!", "Success");
        });
    } else {
      // If not valid, show error message

      setIsErrorVisible(true); // Show the error popup
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setNewEvent({ ...newEvent, [e.target.id]: e.target.value });
    if (isErrorVisible) {
      setErrors({
        title: "",
        venue: "",
        city: "",
        country: "",
        description: "",
        mode: "",
        thumbnail: "",
        startDate: "",
        endDate: "",
        categories: "",
      }); // Clear error message when user starts typing
      setIsErrorVisible(false); // Hide error popup when typing
    }
  };

  const handleCategoryChange = (selectedOptions: any) => {
    setNewEvent({
      ...newEvent,
      categories: selectedOptions.map((item: any) => item.value) || [],
    }); // Update categories in newEvent
    setIsErrorVisible(false);
    setIsMenuOpen(true); // Keep the menu open
  };

  const handleModeChange = (selectedOption: any) => {
    setNewEvent({
      ...newEvent,
      mode: selectedOption.value, // Update mode in newEvent
    });
    setIsErrorVisible(false);
  };
  // console.log(newEvent);

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
                top="10px"
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
                  maxHeight="50px"
                  objectFit="cover"
                  marginRight="10px" // Add some space between the image and the message box
                />
                <Box
                  backgroundColor="white"
                  borderRadius="md"
                  padding="10px"
                  boxShadow="md"
                  maxWidth="180px" // You can adjust this width as needed
                >
                  Great Job! The event looks great!
                </Box>
              </Box>
            )}
          </Box>
          <Box marginLeft={{ base: "0", md: "50px" }}>
            <form onSubmit={handleAddEvent}>
              <Stack padding={3} spacing={4}>
                <Heading>Create a New Event</Heading>

                <FormControl isInvalid={!!errors.title && isErrorVisible}>
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

                <FormControl isInvalid={!!errors.venue && isErrorVisible}>
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
                    <FormControl isInvalid={!!errors.city && isErrorVisible}>
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
                    <FormControl isInvalid={!!errors.country && isErrorVisible}>
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
                    <FormControl isInvalid={!!errors.mode && isErrorVisible}>
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
                      <FormErrorMessage>{errors.mode}</FormErrorMessage>
                    </FormControl>
                  </Box>
                  <Box>
                    <FormControl
                      isInvalid={!!errors.thumbnail && isErrorVisible}
                    >
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
                    <FormControl
                      isInvalid={!!errors.startDate && isErrorVisible}
                    >
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
                    <FormControl isInvalid={!!errors.endDate && isErrorVisible}>
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
                <FormControl isInvalid={!!errors.categories && isErrorVisible}>
                  <label>Categories</label>
                  <Select
                    isMulti
                    options={categoryOptions}
                    onChange={handleCategoryChange}
                    onFocus={() => setIsMenuOpen(true)} // Open the menu on focus
                    onBlur={() => setIsMenuOpen(false)} // Close the menu when focus is lost
                    menuIsOpen={isMenuOpen} // Control the visibility of the menu
                    placeholder="Select Categories"
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
                  <FormErrorMessage>{errors.categories}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.description && isErrorVisible}>
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
                  Create
                </Button>
              </Stack>
            </form>
          </Box>
        </Grid>
      </Box>
    </>
  );
};

export default EventPost;
