const axios = require('axios');
const { faker } = require('@faker-js/faker');

const userTokens = [
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzMwNjExODkxfQ.cUVsds9VWSOmaSjaHsbYrUo-VADUFN8KcdYqyxC1GNM', // Token for user 1
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzMwNjE1NTY2fQ.jEIRnddEeOkLtaCM4ncgJsHhXatAoTlI4CYWgYBI9-M', // Token for user 2
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNzMwNjE1NTk2fQ.gE-1T69sQbfSQL2LmUPaCkzrjEa1gURZvv5gtikbp5U', // Token for user 3
];

// Helper function to get a random future date
const getRandomFutureDate = (startDate, maxDaysAhead = 60) => {
  const date = new Date(startDate);
  const randomDays = faker.number.int({ min: 1, max: maxDaysAhead });
  date.setDate(date.getDate() + randomDays);
  return date.toISOString();
};

// Helper function to select two unique random numbers between 1 and 10
const getRandomCategories = () => {
  const categories = new Set();
  while (categories.size < 2) {
    categories.add(faker.number.int({ min: 1, max: 10 }));
  }
  return Array.from(categories);
};

// Function to create a fake event
const createFakeEvent = () => {
  const startDate = getRandomFutureDate(new Date(), 30); // Start date is within the next 30 days
  const endDate = getRandomFutureDate(new Date(startDate), 30); // End date is after start date

  return {
    title: faker.company.name(),
    venue: faker.company.catchPhrase(),
    city: faker.location.city(),
    country: faker.location.country(),
    description: faker.lorem.sentence(),
    mode: faker.helpers.arrayElement(['Online', 'Physical', 'Hybrid']),
    thumbnail: faker.image.url({ width: 256, height: 256 }),
    startDate,
    endDate,
    categories: getRandomCategories(),
  };
};

// Function to post a fake event for a specific user
const postFakeEvent = async (event, token) => {
  try {
    const response = await axios.post('http://127.0.0.1:3000/api/events', event, {
      headers: { 'x-auth-token': token },
    });
    console.log('Event created:', response.data);
  } catch (error) {
    console.error('Error creating event:', error.message);
  }
};

// Main function to generate and post 10 events for each user
const generateAndPostEvents = async () => {
  for (const token of userTokens) {
    console.log(`Generating events for user with token: ${token}`);

    const events = Array.from({ length: 5 }, createFakeEvent);
    for (const event of events) {
      await postFakeEvent(event, token);
    }
  }
};

// Run the script
generateAndPostEvents();
