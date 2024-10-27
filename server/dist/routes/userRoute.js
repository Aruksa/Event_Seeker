"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const userController_1 = require("../controllers/userController");
const auth = require("../middlewares/auth");
const express = require("express");
const router = express.Router();
router.post("/", userController_1.createUser);
router.get("/", auth, userController_1.getUser);
exports.default = router;
