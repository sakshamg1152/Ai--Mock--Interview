import { Router } from "express";
import {getDashboard , getPendingInterviews} from "../controllers/home.controller.js";
import { verifyUser } from "../middleware/auth.middleware.js";

const router = Router();

router.get(
    "/getdash",
    verifyUser,
    getDashboard
);

router.get(
    "/pending",
    verifyUser,
    getPendingInterviews
);



export default router;
