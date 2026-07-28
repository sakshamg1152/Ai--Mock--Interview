import { Router } from "express";
import {createInterview , getAllInterviews , getInterviewById , searchInterview} from "../controllers/interview.controller.js";
import { verifyUser } from "../middleware/auth.middleware.js";

const router = Router();

router.post(
    "/create",
    verifyUser,
    createInterview
);
router.get(
    "/search",
    verifyUser,
    searchInterview
);
router.get("/",  verifyUser, getAllInterviews);
router.get("/:id",  verifyUser, getInterviewById);


export default router;
