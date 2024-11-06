import client from "./config/elasticSearch";
const createEventIndex = async () => {
  const index = "events";
  const exists = await client.indices.exists({ index });
  if (!exists) {
    await client.indices.create({
      index,
      body: {
        mappings: {
          properties: {
            title: { type: "text" },
            venue: { type: "text" },
            city: { type: "text" },
            country: { type: "text" },
            mode: { type: "text" },
            thumbnail: { type: "text" },
            startDate: { type: "date" },
            endDate: { type: "date" },
            userId: { type: "integer" },
            avg_attendance: { type: "float" },
          },
        },
      },
    });
    console.log(`Index "${index}" created.`);
  } else {
    console.log(`Index "${index}" already exists.`);
  }
};
export default createEventIndex;
