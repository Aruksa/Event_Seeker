import { getScore, postScore } from "../controllers/attdsController";
const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");

router.post("/", auth, postScore);
router.get("/", auth, getScore);

export default router;
