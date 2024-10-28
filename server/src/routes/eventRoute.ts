import { getScore, postScore } from "../controllers/attdsController";
import { postEvent } from "../controllers/eventController";
const auth = require("../middlewares/auth");
const express = require("express");
const router = express.Router();

router.post("/", auth, postEvent);
router.post("/:id/attds", auth, postScore);
router.get("/:id/attds", auth, getScore);

export default router;
