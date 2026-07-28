import { Router } from "express";
import {answerChecking , getSubmissionById} from "../controllers/submission.controller.js";
import { verifyUser } from "../middleware/auth.middleware.js";
const router = Router();

router.post(
    "/answer",
    verifyUser,
    answerChecking
);

router.get(
    "/sub/:id",
    verifyUser,
    getSubmissionById
);


export default router;