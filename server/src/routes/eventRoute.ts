import { getScore, postScore } from "../controllers/attdsController";
import { getEvents, postEvent } from "../controllers/eventController";
const auth = require("../middlewares/auth");
const express = require("express");
const router = express.Router();

router.post("/", auth, postEvent);
router.get("/", auth, getEvents);
router.post("/:id/attds", auth, postScore);
router.get("/:id/attds", auth, getScore);

export default router;
