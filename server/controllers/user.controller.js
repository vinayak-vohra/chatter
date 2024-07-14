import ApiError from "../classes/ApiError.class.js";
import ApiResponse from "../classes/ApiResponse.class.js";

import { User } from "../models/user.model.js";
import { wrapper } from "../utils/requestWrapper.js";

export const fetchUserInfo = wrapper(async (req, res) => {
  // throw error, if any, occurred in any middleware
  if (req.error) throw req.error;

  // uid is needed to process request
  if (!req.user?.uid) {
    throw new ApiError(403, "auth/invalid-access-token");
  }

  // find user in db
  let user = await User.findOne({ uid: req.user.uid });

  // uid not found, create new user
  if (!user) {
    user = await new User({ ...req.user }).save();
  }

  return res.status(200).send(new ApiResponse(200, user, "get/user-info"));
});
