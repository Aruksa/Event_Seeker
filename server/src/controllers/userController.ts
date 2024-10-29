import { Request, Response } from "express";
const config = require("config");
const jwt = require("jsonwebtoken");
import db from "../models/index";
import { Model, ModelStatic } from "sequelize";
const _ = require("lodash");
const bcrypt = require("bcrypt");

const userModel = db.user as ModelStatic<Model>;

export const createUser = async (req: Request, res: Response) => {
  try {
    let user = await userModel.findOne({ where: { email: req.body.email } });
    if (user) return res.status(400).send("User already registered");

    let temp = _.pick(req.body, ["name", "email", "password"]);
    const salt = await bcrypt.genSalt(10);
    temp.password = await bcrypt.hash(temp.password, salt);

    user = await userModel.create(temp);

    const token = jwt.sign({ id: user.get("id") }, "jwtPrivateKey");

    res.status(201).send(token);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    let user = await userModel.findOne({ where: { id: req.user.id } });
    res.status(200).json(_.pick(user, ["name", "email"]));
  } catch (error) {
    res.status(400).send(error);
  }
};
