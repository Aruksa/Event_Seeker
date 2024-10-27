const config = require("config");
const jwt = require("jsonwebtoken");
import { Request, Response } from "express";
import db from "../models/index";
import { Model, ModelStatic } from "sequelize";
const _ = require("lodash");
const bcrypt = require("bcrypt");

export const login = async (req: Request, res: Response) => {
  try {
    const userModel = db.user as ModelStatic<Model>;
    let user = await userModel.findOne({ where: { email: req.body.email } });
    if (!user) return res.status(400).send("Invalid email or password.");

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.get("password")
    );
    if (!validPassword)
      return res.status(400).send("Invalid email or password.");

    const token = jwt.sign({ id: user.get("id") }, "jwtPrivateKey");
    res.status(200).send(token);
  } catch (error) {
    res.status(400).send(error);
  }
};
