import { getScore, postScore } from "../controllers/attdsController";
import {
  deleteEvent,
  getEvent,
  getEvents,
  postEvent,
  updateEvent,
} from "../controllers/eventController";
const auth = require("../middlewares/auth");
const express = require("express");
const router = express.Router();

router.post("/", auth, postEvent);
router.get("/", getEvents);

router.get("/:id", getEvent);
router.delete("/:id", auth, deleteEvent);
router.put("/:id", auth, updateEvent);

router.post("/:id/attds", auth, postScore);
router.get("/:id/attds", auth, getScore);

export default router;
