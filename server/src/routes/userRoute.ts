import { createUser, getUser } from "../controllers/userController";
const auth = require("../middlewares/auth");
const express = require("express");
const router = express.Router();

router.post("/", createUser);
router.get("/", auth, getUser);

export default router;
