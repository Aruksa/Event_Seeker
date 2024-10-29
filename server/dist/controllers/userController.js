"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = exports.createUser = void 0;
const config = require("config");
const jwt = require("jsonwebtoken");
const index_1 = __importDefault(require("../models/index"));
const _ = require("lodash");
const bcrypt = require("bcrypt");
const userModel = index_1.default.user;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let user = yield userModel.findOne({ where: { email: req.body.email } });
        if (user)
            return res.status(400).send("User already registered");
        let temp = _.pick(req.body, ["name", "email", "password"]);
        const salt = yield bcrypt.genSalt(10);
        temp.password = yield bcrypt.hash(temp.password, salt);
        user = yield userModel.create(temp);
        const token = jwt.sign({ id: user.get("id") }, "jwtPrivateKey");
        res.status(201).send(token);
    }
    catch (error) {
        res.status(400).send(error);
    }
});
exports.createUser = createUser;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let user = yield userModel.findOne({ where: { id: req.user.id } });
        res.status(200).json(_.pick(user, ["name", "email"]));
    }
    catch (error) {
        res.status(400).send(error);
    }
});
exports.getUser = getUser;
