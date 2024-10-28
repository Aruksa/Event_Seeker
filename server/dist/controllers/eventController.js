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
exports.getEvents = exports.postEvent = void 0;
const index_1 = __importDefault(require("../models/index"));
const sequelize_1 = require("sequelize");
const _ = require("lodash");
const eventModel = index_1.default.event;
const eventCategoryModel = index_1.default.event_categories;
const postEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const { title, venue, city, country, description, mode, thumbnail, startDate, endDate, categories, } = req.body;
        const formattedStartDate = new Date(startDate).toISOString();
        const formattedEndDate = new Date(endDate).toISOString();
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
        const eventCategoryData = categories.map((categoryId) => ({
            eventId: event.id,
            categoryId: categoryId,
        }));
        yield eventCategoryModel.bulkCreate(eventCategoryData);
        res.status(201).json(Object.assign(Object.assign({}, _.omit(event.dataValues, ["userId"])), { categories: categories }));
    }
    catch (error) {
        res.status(400).send(error);
    }
});
exports.postEvent = postEvent;
const getEvents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Pagination parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
        const offset = (page - 1) * limit;
        // Search and filter parameters
        const search = req.query.search;
        const city = req.query.city;
        const country = req.query.country;
        const startDate = req.query.startDate;
        const endDate = req.query.endDate;
        const whereClause = {};
        if (search) {
            whereClause.title = { [sequelize_1.Op.iLike]: `%${search}%` };
        }
        if (city) {
            whereClause.city = { [sequelize_1.Op.iLike]: city };
        }
        if (country) {
            whereClause.country = { [sequelize_1.Op.iLike]: country };
        }
        if (startDate && endDate) {
            whereClause.startDate = { [sequelize_1.Op.between]: [startDate, endDate] };
        }
        else if (startDate) {
            whereClause.startDate = { [sequelize_1.Op.gte]: startDate }; // Filter events from start date onwards
        }
        else if (endDate) {
            whereClause.startDate = { [sequelize_1.Op.lte]: endDate }; // Filter events up to end date
        }
        // Fetch paginated events with filters applied and calculate average attendance score
        // const { rows: events, count } = await eventModel.findAndCountAll({
        //   where: whereClause,
        //   limit,
        //   offset,
        //   order: [["startDate", "ASC"]],
        //   include: [
        //     {
        //       model: db.attendance as ModelStatic<Model>,
        //       // right: true,
        //       // required: true,
        //       attributes: [
        //         [fn("AVG", col("attendance_type")), "averageAttendance"],
        //       ],
        //     },
        //   ],
        //   group: ["event.id"],
        // });
        const events = yield eventModel.findAll({
            attributes: [
                "title",
                [(0, sequelize_1.fn)("AVG", (0, sequelize_1.col)("attendances.attendance_type")), "avg_attendance"],
            ],
            include: [
                {
                    model: index_1.default.attendance,
                    attributes: [], // Exclude rating columns in the final result
                },
            ],
            group: ["event.id"], // Group by the event primary key
        });
        res.status(200).json({
            events,
            currentPage: page,
            // totalPages: Math.ceil((events.length as number) / limit),
            // totalEvents: count,
        });
    }
    catch (error) {
        res.status(400).send(error);
    }
});
exports.getEvents = getEvents;
