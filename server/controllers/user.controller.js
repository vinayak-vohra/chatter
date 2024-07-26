import mongoose from "mongoose";
import ApiError from "../classes/ApiError.class.js";
import ApiResponse from "../classes/ApiResponse.class.js";

import { User } from "../models/user.model.js";
import { wrapper } from "../utils/requestWrapper.js";

const searchPipeline = (_id, query) => [
  {
    $match: {
      $and: [
        // exclude current user
        { _id: { $ne: _id } },

        // match either name or email
        {
          $or: [
            { name: { $regex: query, $options: "i" } },
            { email: { $regex: query, $options: "i" } },
          ],
        },
      ],
    },
  },
  { $match: { $expr: { $not: { $in: [_id.toString(), "$friends"] } } } },
  { $project: { name: 1, email: 1, photoURL: 1 } },
];

export const fetchUserInfo = wrapper(async (req, res) => {
  // throw error, if any, occurred in any middleware
  if (req.error) throw req.error;

  // uid is needed to process request
  if (!req.user?._id) {
    throw new ApiError(403, "auth/invalid-access-token");
  }

  // find user in db
  let user = await User.findById(req.user._id);

  // _id not found, create new user
  if (!user) {
    user = await new User({ ...req.user }).save();
  }

  return res.status(200).send(new ApiResponse(200, user, "get/user-info"));
});

export const searchUsers = wrapper(async (req, res) => {
  // throw error, if any, occurred in any middleware
  if (req.error) throw req.error;

  // uid is needed to process request
  if (!req.user?._id) {
    throw new ApiError(403, "auth/invalid-access-token");
  }

  // get query value
  const { query } = req.query;

  // minimum 3 characters to search
  if (!query || query.length < 3)
    throw new ApiError(400, "request/invalid-query-length");

  const pipeline = searchPipeline(req.user._id, query);
  console.log(pipeline, req.user._id);
  let users = await User.aggregate(pipeline);

  return res.status(200).send(new ApiResponse(200, users, "get/users"));
});
