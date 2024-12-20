import { literal, Model, ModelStatic } from "sequelize";
import db from "../models/index";
import { Request, Response } from "express";
import { Op, fn, col } from "sequelize";
import { EventInstance } from "../models/event";
import { EventCategoriesInstance } from "../models/event_categories";
import { AttendanceInstance } from "../models/attendance";
import client from "../config/elasticSearch";

const _ = require("lodash");
const eventModel = db.event as ModelStatic<EventInstance>;
const eventCategoryModel =
  db.event_categories as ModelStatic<EventCategoriesInstance>;
const attendanceModel = db.attendance as ModelStatic<AttendanceInstance>;
const categoryModel = db.category as ModelStatic<Model>;

interface EventForES {
  id?: string;
  title: string;
  venue: string;
  city: string;
  country: string;
  mode: string;
  thumnail: string;
  startDate: string;
  endDate: string;
  userId: number;
  avg_attendance: number;
}

export const postEvent = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const {
      title,
      venue,
      city,
      country,
      description,
      mode,
      thumbnail,
      startDate,
      endDate,
      categories,
    } = req.body;

    const formattedStartDate = new Date(startDate).toISOString();
    const formattedEndDate = new Date(endDate).toISOString();

    let events = await eventModel.findOne({
      where: {
        title: title,
        // venue: venue,
        // city: city,
        // country: country,
        // [Op.or]: [
        //   {
        //     startDate: {
        //       [Op.lte]: formattedStartDate,
        //     },
        //     endDate: {
        //       [Op.gte]: formattedStartDate,
        //     },
        //   },
        //   {
        //     startDate: {
        //       [Op.between]: [formattedStartDate, formattedEndDate],
        //     },
        //   },
        // ],
      },
    });

    if (events) {
      return res.status(400).send("Event cannot have the same title!");
    }

    let event = await eventModel.create({
      title: title,
      userId: userId,
      description: description,
      mode: mode,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      venue: venue,
      city: city,
      country: country,
      thumbnail: thumbnail,
    });

    const eventCategoryData = categories.map((categoryId: number) => ({
      eventId: event.id,
      categoryId: categoryId,
    }));

    await eventCategoryModel.bulkCreate(eventCategoryData);

    await client.index({
      index: "events",
      id: `${event.id}`,
      body: {
        title: event.title,
        venue: event.venue,
        city: event.city,
        country: event.country,
        mode: event.mode,
        thumbnail: event.thumbnail,
        startDate: event.startDate,
        endDate: event.endDate,
        avg_attendance: 0,
        userId: userId,
      },
    });

    res.status(201).json({
      ..._.omit(event.dataValues, ["userId"]),
      categories: categories,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

export const getEvents = async (req: Request, res: Response) => {
  const userId = req.user ? req.user.id : null;
  try {
    // Pagination parameters
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50; // Default to 50 items per page
    const offset = (page - 1) * limit;

    const search = req.query.search as string;
    const city = req.query.city as string;
    const country = req.query.country as string;
    const venue = req.query.venue as string;
    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;

    // const whereClause: any = {};

    // if (search) {
    //   whereClause.title = { [Op.iLike]: `%${search}%` };
    // }
    // if (venue) {
    //   whereClause.venue = { [Op.iLike]: `%${venue}%` };
    // }
    // if (city) {
    //   whereClause.city = { [Op.iLike]: `%${city}%` };
    // }
    // if (country) {
    //   whereClause.country = { [Op.iLike]: `%${country}%` };
    // }
    // if (startDate && endDate) {
    //   whereClause.startDate = { [Op.between]: [startDate, endDate] };
    // } else if (startDate) {
    //   whereClause.startDate = { [Op.gte]: startDate };
    // } else if (endDate) {
    //   whereClause.startDate = { [Op.lte]: endDate };
    // }

    // if (userId) {
    //   whereClause.userId = userId;
    // }

    // const events = await eventModel.findAll({
    //   attributes: [
    //     "id",
    //     "title",
    //     "venue",
    //     "city",
    //     "country",
    //     "description",
    //     "mode",
    //     "thumbnail",
    //     "startDate",
    //     "endDate",

    //     [
    //       fn(
    //         "COALESCE",
    //         fn("ROUND", fn("AVG", col("attendances.attendance_type")), 2),
    //         0
    //       ),
    //       "avg_attendance",
    //     ],
    //   ],
    //   where: whereClause,
    //   include: [
    //     {
    //       model: db.attendance as ModelStatic<Model>,
    //       attributes: [],
    //     },
    //   ],
    //   group: ["event.id"],
    //   order: [["startDate", "ASC"]],
    //   limit,
    //   subQuery: false,
    //   offset,
    // });

    const elasticQuery: any = {
      index: "events",
      from: offset,
      size: limit,
      body: {
        query: {
          bool: {
            must: [
              { match_all: {} },
              ...(search ? [{ match_phrase_prefix: { title: search } }] : []),
              ...(venue ? [{ match_phrase_prefix: { venue } }] : []),
              ...(city ? [{ match_phrase_prefix: { city } }] : []),
              ...(country ? [{ match_phrase_prefix: { country } }] : []),
              ...(startDate ? [{ match: { startDate: startDate } }] : []),
              ...(endDate ? [{ match: { endDate: endDate } }] : []),
            ],
            filter: [...(userId ? [{ term: { userId: userId } }] : [])],
            // must: [
            //   { match_all: {} },
            //   ...(search ? [{ match_phrase_prefix: { title: search } }] : []),
            //   ...(venue ? [{ match_phrase_prefix: { venue } }] : []),
            //   ...(city ? [{ match_phrase_prefix: { city } }] : []),
            //   ...(country ? [{ match_phrase_prefix: { country } }] : []),
            //   ...(startDate || endDate
            //     ? [
            //         {
            //           range: {
            //             startDate: {
            //               ...(startDate ? { gte: startDate } : {}),
            //               ...(endDate ? { lte: endDate } : {}),
            //             },
            //           },
            //         },
            //       ]
            //     : []),
            //   ...(userId ? [{ term: { userId: userId } }] : []),
            // ],
          },
        },
        sort: [{ startDate: { order: "asc" } }],
      },
    };

    const { hits } = await client.search(elasticQuery);

    const events = hits.hits.map((hit) => {
      const { userId, ...eventData } = hit._source as EventForES;
      return {
        ...eventData,
        userId,
        id: parseInt(hit._id!),
      };
    });

    res.status(200).json(events);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const getEvent = async (req: Request, res: Response) => {
  try {
    const eventId = req.params.id;

    // Fetch event details with attendees' information
    const event = await eventModel.findOne({
      where: { id: eventId },
      attributes: [
        "id",
        "title",
        "description",
        "mode",
        "startDate",
        "endDate",
        "venue",
        "city",
        "country",
        "thumbnail",
        [
          literal(`(
            SELECT JSON_AGG(
              JSON_BUILD_OBJECT(
                'userName', users.name,
                'attendance_type', attendances.attendance_type,
                'review', attendances.review
              )
            )
            FROM attendances
            INNER JOIN users ON attendances."userId" = users.id
            WHERE attendances."eventId" = ${eventId}
          )`),
          "attendees",
        ],
      ],
      include: [
        {
          model: attendanceModel,
          attributes: [], // Prevents duplication in grouping
        },
      ],
      group: ["event.id"],
    });

    const categories = await eventCategoryModel.findAll({
      where: { eventId: eventId },
    });

    const not_interested = await attendanceModel.count({
      where: {
        eventId: eventId,
        attendance_type: 1,
      },
    });

    const interested = await attendanceModel.count({
      where: {
        eventId: eventId,
        attendance_type: 3,
      },
    });

    const going = await attendanceModel.count({
      where: {
        eventId: eventId,
        attendance_type: 5,
      },
    });

    if (!event) {
      return res.status(404).send("Event not found!");
    }

    if (!categories) {
      return res.status(404).send("Event category not found!");
    }

    const totalResponses = not_interested + interested + going;
    const avg_attendance =
      totalResponses > 0
        ? (
            (5 * going + 3 * interested + 1 * not_interested) /
            totalResponses
          ).toFixed(2)
        : "No Rating";

    if (parseFloat(avg_attendance) != 0) {
      await client.update({
        index: "events",
        id: eventId,
        doc: {
          avg_attendance: parseFloat(avg_attendance),
        },
      });
    }

    res.status(200).json({
      event: event,
      categories: categories.map((category) => category.categoryId),
      not_interested,
      interested,
      going,
      avg_attendance: avg_attendance,

      // attendees: event.dataValues.attendees,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const eventId = req.params.id;

    let deleted = await eventModel.destroy({
      where: { userId: userId, id: eventId },
    });

    if (!deleted) {
      return res
        .status(401)
        .send("Event not found or user not authorized to delete this event!");
    }

    await client.delete({
      index: "events",
      id: eventId,
    });

    res.status(200).send("Deleted!");
  } catch (error) {
    res.status(400).send(error);
  }
};

export const updateEvent = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const eventId = req.params.id;

    let event = await eventModel.findOne({
      where: { userId: userId, id: eventId },
    });

    if (!event) {
      return res
        .status(404)
        .send("Event not found or user not authorized to update this event.");
    }

    const formattedStartDate = new Date(req.body.startDate).toISOString();
    const formattedEndDate = new Date(req.body.endDate).toISOString();

    let events = await eventModel.findOne({
      where: {
        id: { [Op.ne]: eventId }, // Exclude the current event
        title: req.body.title,
        // venue: req.body.venue,
        // city: req.body.city,
        // country: req.body.country,
        // [Op.or]: [
        //   {
        //     startDate: {
        //       [Op.lte]: formattedStartDate,
        //     },
        //     endDate: {
        //       [Op.gte]: formattedStartDate,
        //     },
        //   },
        //   {
        //     startDate: {
        //       [Op.between]: [formattedStartDate, formattedEndDate],
        //     },
        //   },
        // ],
      },
    });

    if (events) {
      return res.status(400).send("Event cannot have the same title!");
    }

    // Update the event
    const updatedEvent = await event.update({
      title: req.body.title,
      description: req.body.description,
      mode: req.body.mode,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      venue: req.body.venue,
      city: req.body.city,
      country: req.body.country,
      thumbnail: req.body.thumbnail,
    });

    // Update Elasticsearch index (for syncing with search results)
    await client.update({
      index: "events",
      id: eventId,
      doc: {
        title: req.body.title || event.title,
        description: req.body.description || event.description,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        mode: req.body.mode || event.mode,
        venue: req.body.venue || event.venue,
        city: req.body.city || event.city,
        country: req.body.country || event.country,
        thumbnail: req.body.thumbnail || event.thumbnail,
      },
    });

    res.status(200).json({
      updatedEvent: updatedEvent.dataValues,
      categories: req.body.categories,
    });
  } catch (error) {
    console.error(error);
    res.status(400).send("An error occurred while updating the event.");
  }
};

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await categoryModel.findAll();
    res.status(200).json(categories);
  } catch (error) {
    res.status(404).send(error);
  }
};
