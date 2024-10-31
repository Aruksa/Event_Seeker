import { FormEvent, useState } from "react";
import { useCategoriesContext } from "../contexts/categoriesContext";
import { useEventsContext } from "../contexts/eventsContext";
import { useUserContext } from "../contexts/userContext";
import axios from "axios";
import Select from "react-select";
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
} from "@chakra-ui/react";
import { category } from "../types/category";
import { useNavigate } from "react-router-dom";

const EventPost = () => {
  const navigate = useNavigate();
  const { userState } = useUserContext();
  const { categories } = useCategoriesContext();
  const { eventsState, eventsDispatch } = useEventsContext();

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

  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toISOString().slice(0, 16); //'YYYY-MM-DDTHH:MM'
  };

  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  const [isErrorVisible, setIsErrorVisible] = useState(false); // State for controlling error visibility

  const categoryOptions = categories.map((category) => ({
    value: category.id,
    label: category.name,
  }));

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
    newEvent.endDate.trim() !== "" &&
    newEvent.categories.length > 0;

  const handleAddEvent = (e: FormEvent) => {
    e.preventDefault();

    // Only proceed with submission if the form is valid
    if (isFormValid) {
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
          setErrorMessage(""); // Clear error message on successful submission
          setIsErrorVisible(false); // Hide error popup
          navigate("/");
        })
        .catch((error) => console.log(error));
    } else {
      // If not valid, show error message
      setErrorMessage("Please fill in all fields before submitting!"); // Set error message
      setIsErrorVisible(true); // Show the error popup
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

  const handleCategoryChange = (selectedOptions: any) => {
    setNewEvent({
      ...newEvent,
      categories: selectedOptions.map((item: any) => item.value) || [],
    }); // Update categories in newEvent
  };

  const handleModeChange = (selectedOption: any) => {
    setNewEvent({
      ...newEvent,
      mode: selectedOption.value, // Update mode in newEvent
    });
  };
  // console.log(newEvent);

  return (
    <>
      <Box display="flex" justifyContent="center" padding={5}>
        {/* Container Grid for Image and Form */}
        <Grid
          templateColumns={{ base: "1fr", md: "1fr 2fr" }}
          gap={10}
          alignItems="center"
          maxWidth="80%"
        >
          {/* Left Column: Image Placeholder */}
          <Image
            src="https://img.freepik.com/free-vector/connected-world-concept-illustration_114360-3621.jpg?t=st=1730347198~exp=1730350798~hmac=58d7b76e416022edc8362d2a642acb02a2e09c81580c75223f363501b6da2838&w=740"
            alt="Event Image"
            objectFit="cover"
            borderRadius="lg"
            boxSize="400px"
            width="100%" // Adjust width to 100% for responsiveness
            height="auto" // Maintain aspect ratio
          />

          {/* Right Column: Event Form */}
          <form onSubmit={handleAddEvent}>
            <Stack padding={5} spacing={5}>
              {isErrorVisible && (
                <Alert borderRadius={10} status="error">
                  <AlertIcon />
                  <AlertTitle>{errorMessage}</AlertTitle>
                </Alert>
              )}

              <Grid templateColumns="150px 1fr" gap={5} alignItems="center">
                <label htmlFor="title">Title</label>
                <Input
                  id="title"
                  type="text"
                  variant="unstyled"
                  value={newEvent.title}
                  placeholder="Insert a title..."
                  onChange={handleChange}
                  backgroundColor="white"
                  _placeholder={{ color: "gray.500" }}
                />

                <label htmlFor="venue">Venue</label>
                <Input
                  id="venue"
                  type="text"
                  variant="unstyled"
                  value={newEvent.venue}
                  placeholder="Insert venue..."
                  onChange={handleChange}
                  backgroundColor="white"
                  _placeholder={{ color: "gray.500" }}
                />

                {/* City and Country on the Same Row */}
                <label>Location</label>
                <Grid templateColumns="1fr 1fr" gap={5}>
                  <Input
                    id="city"
                    type="text"
                    variant="unstyled"
                    value={newEvent.city}
                    placeholder="City"
                    onChange={handleChange}
                    backgroundColor="white"
                    _placeholder={{ color: "gray.500" }}
                  />
                  <Input
                    id="country"
                    type="text"
                    variant="unstyled"
                    value={newEvent.country}
                    placeholder="Country"
                    onChange={handleChange}
                    backgroundColor="white"
                    _placeholder={{ color: "gray.500" }}
                  />
                </Grid>

                <label htmlFor="description">Description</label>
                <Textarea
                  id="description"
                  variant="unstyled"
                  value={newEvent.description}
                  placeholder="Description..."
                  onChange={handleChange}
                  backgroundColor="white"
                  _placeholder={{ color: "gray.500" }}
                  maxH="200px" // Set max height for the Textarea
                  overflowY="auto"
                />

                <label htmlFor="mode">Mode</label>
                <Box>
                  <Select
                    name="mode"
                    options={modeOptions}
                    classNamePrefix="select"
                    onChange={handleModeChange} // Handle mode change
                    placeholder="Select Mode"
                    aria-label="Select Mode"
                    styles={{
                      control: (base) => ({
                        ...base,
                        backgroundColor: "white",
                        borderColor: "#CBD5E0",
                        minHeight: "40px",
                      }),
                    }}
                  />
                </Box>

                <label htmlFor="thumbnail">Thumbnail</label>
                <Input
                  id="thumbnail"
                  type="text"
                  variant="unstyled"
                  value={newEvent.thumbnail}
                  placeholder="Insert thumbnail..."
                  onChange={handleChange}
                  backgroundColor="white"
                  _placeholder={{ color: "gray.500" }}
                />

                <label htmlFor="startDate">Start Date</label>
                <input
                  id="startDate"
                  type="datetime-local"
                  value={newEvent.startDate}
                  min={getCurrentDateTime()}
                  onChange={handleChange}
                />

                <label htmlFor="endDate">End Date</label>
                <input
                  id="endDate"
                  type="datetime-local"
                  value={newEvent.endDate}
                  min={getCurrentDateTime()}
                  onChange={handleChange}
                />

                <label>Categories</label>
                <Box>
                  <Select
                    isMulti
                    name="categories"
                    options={categoryOptions}
                    classNamePrefix="select"
                    onChange={handleCategoryChange}
                    placeholder="Select Categories"
                    aria-label="Select Categories"
                    styles={{
                      control: (base) => ({
                        ...base,
                        backgroundColor: "white",
                        borderColor: "#CBD5E0",
                        minHeight: "40px", // Adjust minHeight to match other inputs
                      }),
                      multiValue: (base) => ({
                        ...base,
                        backgroundColor: "#B2F5EA",
                        color: "black",
                      }),
                      multiValueLabel: (base) => ({
                        ...base,
                        color: "black",
                      }),
                      multiValueRemove: (base) => ({
                        ...base,
                        color: "black",
                        "&:hover": {
                          backgroundColor: "red",
                          color: "white",
                        },
                      }),
                    }}
                  />
                </Box>
              </Grid>
              <Button type="submit" colorScheme="blue" width="100%">
                Create
              </Button>
            </Stack>
          </form>
        </Grid>
      </Box>
    </>
  );
};

export default EventPost;
