import { Router } from "express";
import { authenticate } from "../middleware/user.middleware.js";
import {
    acceptFriendRequest,
  cancelFriendRequest,
  fetchUserInfo,
  newFriendRequest,
  searchUsers,
} from "../controllers/user.controller.js";

const router = Router();

router.get("/info", authenticate, fetchUserInfo);

router.get("/search", authenticate, searchUsers);

router.post("/new-friend-request", authenticate, newFriendRequest);

router.delete("/friend-request/:id", authenticate, cancelFriendRequest);

router.patch("/friend-request", authenticate, acceptFriendRequest);

export const userRoutes = router;
