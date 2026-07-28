import { Router } from "express";
import {login , register,changePassword} from "../controllers/user.controller.js"
import { verifyUser } from "../middleware/auth.middleware.js";
const router = Router();

router.route("/login").post(login);
router.route("/register").post(register);
router.put("/change-password", verifyUser , changePassword);


export default router;
