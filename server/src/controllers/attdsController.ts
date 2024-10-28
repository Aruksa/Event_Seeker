import { Request, Response } from "express";
import db from "../models/index";
import { Model, ModelStatic } from "sequelize";
const _ = require("lodash");

const attendanceModel = db.attendance as ModelStatic<Model>;

export const postScore = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const eventId = req.params.id;

    let attendance = await attendanceModel.create({
      userId: user.id,
      eventId: eventId,
      attendanceType: req.body.attendanceType,
    });

    res.status(201).json(attendance);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const getScore = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const eventId = req.params.id;

    let score = await attendanceModel.findOne({
      where: { userId: user.id, eventId: eventId },
    });
    if (!score)
      return res.status(404).send("This user has not voted for this event.");
    res.status(200).json(score);
  } catch (error) {
    res.status(400).send(error);
  }
};
