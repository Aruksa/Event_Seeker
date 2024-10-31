import { Model, ModelStatic } from "sequelize";
import db from "../models/index";
import { Request, Response } from "express";
import { Op, fn, col } from "sequelize";
import { EventInstance } from "../models/event";
import { EventCategoriesInstance } from "../models/event_categories";
import { AttendanceInstance } from "../models/attendance";

const _ = require("lodash");
const eventModel = db.event as ModelStatic<EventInstance>;
const eventCategoryModel =
  db.event_categories as ModelStatic<EventCategoriesInstance>;
const attendanceModel = db.attendance as ModelStatic<AttendanceInstance>;
const categoryModel = db.category as ModelStatic<Model>;

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

    if (events) {
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
  const userId = req.user ? req.user.id : null;
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
      whereClause.city = { [Op.iLike]: `%${city}%` };
    }
    if (country) {
      whereClause.country = { [Op.iLike]: `%${country}%` };
    }
    if (startDate && endDate) {
      whereClause.startDate = { [Op.between]: [startDate, endDate] };
    } else if (startDate) {
      whereClause.startDate = { [Op.gte]: startDate }; // Filter events from start date onwards
    } else if (endDate) {
      whereClause.startDate = { [Op.lte]: endDate }; // Filter events up to end date
    }

    if (userId) {
      whereClause.userId = userId; // Assuming events have a `userId` field for ownership
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
        // [fn("AVG", col("attendances.attendance_type")), "avg_attendance"],
        [
          fn("COALESCE", fn("AVG", col("attendances.attendance_type")), 0),
          "avg_attendance",
        ],
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

    res.status(200).json(events);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const getEvent = async (req: Request, res: Response) => {
  try {
    const eventId = req.params.id;

    const event = await eventModel.findByPk(eventId);

    const categories = await eventCategoryModel.findAll({
      where: { eventId: eventId },
    });

    const not_interested = await attendanceModel.count({
      where: {
        eventId: eventId,
        attendance_type: 0,
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

    res.status(200).json({
      event: event,
      categories: categories.map((category) => category.categoryId),
      not_interested: not_interested,
      interested: interested,
      going: going,
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
        venue: req.body.venue,
        city: req.body.city,
        country: req.body.country,
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

    if (events) {
      return res
        .status(400)
        .send(
          "Event cannot have the same title, location, and date as another existing event!"
        );
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
