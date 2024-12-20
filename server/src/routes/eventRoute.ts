import {
  getScore,
  postScore,
  updateScore,
} from "../controllers/attdsController";
import {
  deleteEvent,
  getCategories,
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

router.get("/myEvents", auth, getEvents);

router.get("/categories", getCategories);

router.get("/:id", getEvent);
router.delete("/:id", auth, deleteEvent);
router.put("/:id", auth, updateEvent);

router.post("/:id/attds", auth, postScore);
router.get("/:id/attds", auth, getScore);
router.put("/:id/attds", auth, updateScore);

export default router;
