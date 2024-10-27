"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const eventController_1 = require("../controllers/eventController");
const auth = require("../middlewares/auth");
const express = require("express");
const router = express.Router();
router.post("/", auth, eventController_1.postEvent);
exports.default = router;
