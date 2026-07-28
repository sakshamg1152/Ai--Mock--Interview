import express from "express";
import {verifyUser } from "../middleware/auth.middleware.js";
import { getProfile } from "../controllers/profile.controller.js";

const router = express.Router();

router.get("/", verifyUser, getProfile);

export default router;