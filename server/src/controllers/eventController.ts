import { Model, ModelStatic } from "sequelize";
import db from "../models/index";
import { Request, Response } from "express";
import { Op } from "sequelize";
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
