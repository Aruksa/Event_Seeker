import { login } from "../controllers/authController";
const express = require("express");
const router = express.Router();

router.post("/", login);

export default router;
