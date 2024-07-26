import { Router } from "express";
import { authenticate } from "../middleware/user.middleware.js";
import { fetchUserInfo, searchUsers } from "../controllers/user.controller.js";

const router = Router();

router.get("/info", authenticate, fetchUserInfo);

router.get("/search", authenticate, searchUsers);

export const userRoutes = router;
