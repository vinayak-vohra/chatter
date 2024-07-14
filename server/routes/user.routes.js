import { Router } from "express";
import { authenticate } from "../middleware/user.middleware.js";
import { fetchUserInfo } from "../controllers/user.controller.js";

const router = Router();

router.get("/info", authenticate, fetchUserInfo);

export const userRoutes = router;
