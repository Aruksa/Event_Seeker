import { postEvent } from "../controllers/eventController";
const auth = require("../middlewares/auth");
const express = require("express");
const router = express.Router();

router.post("/", auth, postEvent);

export default router;
