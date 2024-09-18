import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { getChatInfo, getChatId } from "../controllers/chat.controller.js";

const router = Router();

router.get("/", authenticate, getChatInfo);
router.get("/chatId", authenticate, getChatId);

export const chatRoutes = router;
