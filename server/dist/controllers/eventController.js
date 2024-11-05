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
exports.getCategories = exports.updateEvent = exports.deleteEvent = exports.getEvent = exports.getEvents = exports.postEvent = void 0;
const sequelize_1 = require("sequelize");
const index_1 = __importDefault(require("../models/index"));
const sequelize_2 = require("sequelize");
const _ = require("lodash");
const eventModel = index_1.default.event;
const eventCategoryModel = index_1.default.event_categories;
const attendanceModel = index_1.default.attendance;
const categoryModel = index_1.default.category;
const postEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const { title, venue, city, country, description, mode, thumbnail, startDate, endDate, categories, } = req.body;
        const formattedStartDate = new Date(startDate).toISOString();
        const formattedEndDate = new Date(endDate).toISOString();
        let events = yield eventModel.findOne({
            where: {
                title: title,
                venue: venue,
                city: city,
                country: country,
                [sequelize_2.Op.or]: [
                    {
                        startDate: {
                            [sequelize_2.Op.lte]: formattedStartDate,
                        },
                        endDate: {
                            [sequelize_2.Op.gte]: formattedStartDate,
                        },
                    },
                    {
                        startDate: {
                            [sequelize_2.Op.between]: [formattedStartDate, formattedEndDate],
                        },
                    },
                ],
            },
        });
        if (events) {
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
    const userId = req.user ? req.user.id : null;
    try {
        // Pagination parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50; // Default to 50 items per page
        const offset = (page - 1) * limit;
        // Search and filter parameters
        const search = req.query.search;
        const city = req.query.city;
        const country = req.query.country;
        const venue = req.query.venue;
        const startDate = req.query.startDate;
        const endDate = req.query.endDate;
        const whereClause = {};
        if (search) {
            whereClause.title = { [sequelize_2.Op.iLike]: `%${search}%` };
        }
        if (venue) {
            whereClause.venue = { [sequelize_2.Op.iLike]: `%${venue}%` };
        }
        if (city) {
            whereClause.city = { [sequelize_2.Op.iLike]: `%${city}%` };
        }
        if (country) {
            whereClause.country = { [sequelize_2.Op.iLike]: `%${country}%` };
        }
        if (startDate && endDate) {
            whereClause.startDate = { [sequelize_2.Op.between]: [startDate, endDate] };
        }
        else if (startDate) {
            whereClause.startDate = { [sequelize_2.Op.gte]: startDate }; // Filter events from start date onwards
        }
        else if (endDate) {
            whereClause.startDate = { [sequelize_2.Op.lte]: endDate }; // Filter events up to end date
        }
        if (userId) {
            whereClause.userId = userId; // Assuming events have a `userId` field for ownership
        }
        //Fetch paginated events with filters applied and avg_attendance
        const events = yield eventModel.findAll({
            attributes: [
                "id",
                "title",
                "venue",
                "city",
                "country",
                "description",
                "mode",
                "thumbnail",
                "startDate",
                "endDate",
                // [fn("AVG", col("attendances.attendance_type")), "avg_attendance"],
                [
                    (0, sequelize_2.fn)("COALESCE", (0, sequelize_2.fn)("ROUND", (0, sequelize_2.fn)("AVG", (0, sequelize_2.col)("attendances.attendance_type")), 2), 0),
                    "avg_attendance",
                ],
            ],
            where: whereClause,
            include: [
                {
                    model: index_1.default.attendance,
                    attributes: [],
                },
            ],
            group: ["event.id"],
            order: [["startDate", "ASC"]],
            limit,
            subQuery: false,
            offset,
        });
        res.status(200).json(events);
    }
    catch (error) {
        res.status(400).send(error);
    }
});
exports.getEvents = getEvents;
const getEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const eventId = req.params.id;
        // Fetch event details with attendees' information
        const event = yield eventModel.findOne({
            where: { id: eventId },
            attributes: [
                "id",
                "title",
                "description",
                "mode",
                "startDate",
                "endDate",
                "venue",
                "city",
                "country",
                "thumbnail",
                [
                    (0, sequelize_1.literal)(`(
            SELECT JSON_AGG(
              JSON_BUILD_OBJECT(
                'userName', users.name,
                'attendance_type', attendances.attendance_type,
                'review', attendances.review
              )
            )
            FROM attendances
            INNER JOIN users ON attendances."userId" = users.id
            WHERE attendances."eventId" = ${eventId}
          )`),
                    "attendees",
                ],
            ],
            include: [
                {
                    model: attendanceModel,
                    attributes: [], // Prevents duplication in grouping
                },
            ],
            group: ["event.id"],
        });
        const categories = yield eventCategoryModel.findAll({
            where: { eventId: eventId },
        });
        const not_interested = yield attendanceModel.count({
            where: {
                eventId: eventId,
                attendance_type: 1,
            },
        });
        const interested = yield attendanceModel.count({
            where: {
                eventId: eventId,
                attendance_type: 3,
            },
        });
        const going = yield attendanceModel.count({
            where: {
                eventId: eventId,
                attendance_type: 5,
            },
        });
        if (!event) {
            return res.status(404).send("Event not found!");
        }
        if (!categories) {
            return res.status(404).send("Event category not found!");
        }
        const totalResponses = not_interested + interested + going;
        const avg_attendance = totalResponses > 0
            ? ((5 * going + 3 * interested + 1 * not_interested) /
                totalResponses).toFixed(2)
            : "No Rating";
        res.status(200).json({
            event: event,
            categories: categories.map((category) => category.categoryId),
            not_interested,
            interested,
            going,
            avg_attendance: avg_attendance,
            // attendees: event.dataValues.attendees,
        });
    }
    catch (error) {
        res.status(400).send(error);
    }
});
exports.getEvent = getEvent;
const deleteEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const eventId = req.params.id;
        let deleted = yield eventModel.destroy({
            where: { userId: userId, id: eventId },
        });
        if (!deleted) {
            return res
                .status(401)
                .send("Event not found or user not authorized to delete this event!");
        }
        res.status(200).send("Deleted!");
    }
    catch (error) {
        res.status(400).send(error);
    }
});
exports.deleteEvent = deleteEvent;
const updateEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const eventId = req.params.id;
        let event = yield eventModel.findOne({
            where: { userId: userId, id: eventId },
        });
        if (!event) {
            return res
                .status(404)
                .send("Event not found or user not authorized to update this event.");
        }
        const formattedStartDate = new Date(req.body.startDate).toISOString();
        const formattedEndDate = new Date(req.body.endDate).toISOString();
        let events = yield eventModel.findOne({
            where: {
                id: { [sequelize_2.Op.ne]: eventId }, // Exclude the current event
                title: req.body.title,
                venue: req.body.venue,
                city: req.body.city,
                country: req.body.country,
                [sequelize_2.Op.or]: [
                    {
                        startDate: {
                            [sequelize_2.Op.lte]: formattedStartDate,
                        },
                        endDate: {
                            [sequelize_2.Op.gte]: formattedStartDate,
                        },
                    },
                    {
                        startDate: {
                            [sequelize_2.Op.between]: [formattedStartDate, formattedEndDate],
                        },
                    },
                ],
            },
        });
        if (events) {
            return res
                .status(400)
                .send("Event cannot have the same title, location, and date as another existing event!");
        }
        // Update the event
        const updatedEvent = yield event.update({
            title: req.body.title,
            description: req.body.description,
            mode: req.body.mode,
            startDate: formattedStartDate,
            endDate: formattedEndDate,
            venue: req.body.venue,
            city: req.body.city,
            country: req.body.country,
            thumbnail: req.body.thumbnail,
        });
        res.status(200).json({
            updatedEvent: updatedEvent.dataValues,
            categories: req.body.categories,
        });
    }
    catch (error) {
        console.error(error);
        res.status(400).send("An error occurred while updating the event.");
    }
});
exports.updateEvent = updateEvent;
const getCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield categoryModel.findAll();
        res.status(200).json(categories);
    }
    catch (error) {
        res.status(404).send(error);
    }
});
exports.getCategories = getCategories;
