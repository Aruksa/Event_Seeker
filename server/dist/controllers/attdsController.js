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
exports.updateScore = exports.getScore = exports.postScore = void 0;
const index_1 = __importDefault(require("../models/index"));
const _ = require("lodash");
const attendanceModel = index_1.default.attendance;
const postScore = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const eventId = req.params.id;
        let attendance = yield attendanceModel.create({
            userId: user.id,
            eventId: eventId,
            attendance_type: req.body.attendance_type,
        });
        if (req.body.review) {
            attendance.review = req.body.review;
        }
        res.status(201).json(attendance);
    }
    catch (error) {
        res.status(400).send(error);
    }
});
exports.postScore = postScore;
const getScore = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const eventId = req.params.id;
        let score = yield attendanceModel.findOne({
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
    }
    catch (error) {
        res.status(404).send(error);
    }
});
exports.getScore = getScore;
const updateScore = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const eventId = req.params.id;
        let score = yield attendanceModel.findOne({
            where: { userId: user.id, eventId: eventId },
        });
        if (!score) {
            return res.status(404).send("Score not found");
        }
        const updatedScore = yield score.update({
            attendance_type: req.body.attendance_type || score.attendance_type,
            review: req.body.review || score.review,
        });
        res.status(200).json(updatedScore);
    }
    catch (error) {
        res.status(400).send(error);
    }
});
exports.updateScore = updateScore;
