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
exports.login = void 0;
const config = require("config");
const jwt = require("jsonwebtoken");
const index_1 = __importDefault(require("../models/index"));
const _ = require("lodash");
const bcrypt = require("bcrypt");
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userModel = index_1.default.user;
        let user = yield userModel.findOne({ where: { email: req.body.email } });
        if (!user)
            return res.status(400).send("Invalid email or password.");
        const validPassword = yield bcrypt.compare(req.body.password, user.get("password"));
        if (!validPassword)
            return res.status(400).send("Invalid email or password.");
        const token = jwt.sign({ id: user.get("id") }, "jwtPrivateKey");
        res.status(200).send(token);
    }
    catch (error) {
        res.status(400).send(error);
    }
});
exports.login = login;
