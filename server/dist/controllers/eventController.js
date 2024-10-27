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
exports.postEvent = void 0;
const index_1 = __importDefault(require("../models/index"));
const sequelize_1 = require("sequelize");
const eventModel = index_1.default.event;
const postEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const { title, venue, city, country, description, mode, thumbnail, startDate, endDate, } = req.body;
        const formattedStartDate = new Date(startDate).toISOString();
        const formattedEndDate = new Date(endDate).toISOString();
        // Find events where the request's startDate falls within the range of an existing event's start and end dates
        let events = yield eventModel.findAll({
            where: {
                title: title,
                venue: venue,
                city: city,
                country: country,
                [sequelize_1.Op.or]: [
                    {
                        startDate: {
                            [sequelize_1.Op.lte]: formattedStartDate,
                        },
                        endDate: {
                            [sequelize_1.Op.gte]: formattedStartDate,
                        },
                    },
                    {
                        startDate: {
                            [sequelize_1.Op.between]: [formattedStartDate, formattedEndDate],
                        },
                    },
                ],
            },
        });
        if (events.length !== 0) {
            return res
                .status(400)
                .send("Event cannot have the same title, location and date as another existing event!");
        }
        let event = yield eventModel.create({
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
        res.status(201).json(event);
    }
    catch (error) {
        res.status(400).send(error);
    }
});
exports.postEvent = postEvent;
