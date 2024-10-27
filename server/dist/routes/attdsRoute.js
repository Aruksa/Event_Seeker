"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const attdsController_1 = require("../controllers/attdsController");
const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
router.post("/", auth, attdsController_1.postScore);
router.get("/", auth, attdsController_1.getScore);
exports.default = router;
