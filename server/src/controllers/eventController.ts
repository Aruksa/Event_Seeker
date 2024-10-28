import { Model, ModelStatic } from "sequelize";
import db from "../models/index";
import { Request, Response } from "express";
import { Op, fn, col } from "sequelize";
import { EventInstance } from "../models/event";

const _ = require("lodash");
const eventModel = db.event as ModelStatic<EventInstance>;
const eventCategoryModel = db.event_categories as ModelStatic<Model>;

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

    let events = await eventModel.findAll({
      where: {
        title: title,
        venue: venue,
        city: city,
        country: country,
        [Op.or]: [
          {
            startDate: {
              [Op.lte]: formattedStartDate,
            },
            endDate: {
              [Op.gte]: formattedStartDate,
            },
          },
          {
            startDate: {
              [Op.between]: [formattedStartDate, formattedEndDate],
            },
          },
        ],
      },
    });

    if (events.length !== 0) {
      return res
        .status(400)
        .send(
          "Event cannot have the same title, location and date as another existing event!"
        );
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

    res.status(201).json({
      ..._.omit(event.dataValues, ["userId"]),
      categories: categories,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

export const getEvents = async (req: Request, res: Response) => {
  try {
    // Pagination parameters
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5; // Default to 5 items per page
    const offset = (page - 1) * limit;

    // Search and filter parameters
    const search = req.query.search as string;
    const city = req.query.city as string;
    const country = req.query.country as string;
    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;

    const whereClause: any = {};

    if (search) {
      whereClause.title = { [Op.iLike]: `%${search}%` };
    }
    if (city) {
      whereClause.city = { [Op.iLike]: city };
    }
    if (country) {
      whereClause.country = { [Op.iLike]: country };
    }
    if (startDate && endDate) {
      whereClause.startDate = { [Op.between]: [startDate, endDate] };
    } else if (startDate) {
      whereClause.startDate = { [Op.gte]: startDate }; // Filter events from start date onwards
    } else if (endDate) {
      whereClause.startDate = { [Op.lte]: endDate }; // Filter events up to end date
    }

    //Fetch paginated events with filters applied and avg_attendance
    const events = await eventModel.findAll({
      attributes: [
        "id",
        "title",
        "venue",
        "city",
        "country",
        "description",
        "mode",
        "thumbnail",
        "startDate",
        "endDate",
        [fn("AVG", col("attendances.attendance_type")), "avg_attendance"],
      ],
      where: whereClause,
      include: [
        {
          model: db.attendance as ModelStatic<Model>,
          attributes: [],
        },
      ],
      group: ["event.id"],
      order: [["startDate", "ASC"]],
      limit,
      subQuery: false,
      offset,
    });

    res.status(200).json({
      events: events,
      currentPage: page,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

export const getEvent = async (req: Request, res: Response) => {
  try {
  } catch (error) {}
};
