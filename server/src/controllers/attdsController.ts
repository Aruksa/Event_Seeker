import { Request, Response } from "express";
import db from "../models/index";
import { Model, ModelStatic } from "sequelize";
const _ = require("lodash");

const attendanceModel = db.attendance as ModelStatic<Model>;

export const postScore = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const eventId = req.params.id;

    let attendance: any = await attendanceModel.create({
      userId: user.id,
      eventId: eventId,
      attendance_type: req.body.attendance_type,
    });

    if (req.body.review) {
      attendance.review = req.body.review;
    }

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
    if (!score) {
      return res.status(200).json({
        eventId: eventId,
      });
    }
    res
      .status(200)
      .json(_.pick(score, ["eventId", "attendance_type", "review"]));
  } catch (error) {
    res.status(404).send(error);
  }
};
export const updateScore = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const eventId = req.params.id;

    let score: any = await attendanceModel.findOne({
      where: { userId: user.id, eventId: eventId },
    });

    if (!score) {
      return res.status(404).send("Score not found");
    }

    const updatedScore: any = await score.update({
      attendance_type: req.body.attendance_type || score.attendance_type,
      review: req.body.review || score.review,
    });

    res.status(200).json(updatedScore);
  } catch (error) {
    res.status(400).send(error);
  }
};
