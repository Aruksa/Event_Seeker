import { Request, Response } from "express";
import client from "../config/elasticSearch";
import { events } from "@elastic/elasticsearch";

export const getAllEventsFromElastic = async (req: Request, res: Response) => {
  try {
    const result = await client.search({
      index: "events",
      body: {
        query: {
          match_all: {},
        },
      },
      size: 10000,
    });

    const events = result.hits.hits.map((hit: any) => ({
      id: hit._id,
      ...hit._source,
    }));

    res.status(200).json(events);
  } catch (error) {
    res
      .status(500)
      .send({ error: "Failed to fetch events from Elasticsearch" });
  }
};
