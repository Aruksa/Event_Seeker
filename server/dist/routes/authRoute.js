"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authController_1 = require("../controllers/authController");
const express = require("express");
const router = express.Router();
router.post("/", authController_1.login);
exports.default = router;
