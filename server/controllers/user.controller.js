import mongoose from "mongoose";
import ApiError from "../classes/ApiError.class.js";
import ApiResponse from "../classes/ApiResponse.class.js";

import { User } from "../models/user.model.js";
import { wrapper } from "../utils/requestWrapper.js";
import { FriendRequest } from "../models/request.model.js";

const searchPipeline = (_id, query) => [
  {
    $match: {
      $and: [
        // exclude current user
        { _id: { $ne: new mongoose.Types.ObjectId(_id) } },

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

  // exclude friends
  {
    $match: {
      $expr: { $not: { $in: [_id, "$friends"] } },
    },
  },

  // friend request sent by current user
  {
    $lookup: {
      from: "friendrequests",
      localField: "_id",
      foreignField: "to",
      as: "sentRequest",
      pipeline: [{ $match: { from: { $eq: _id } } }],
    },
  },

  // friend request received by current user
  {
    $lookup: {
      from: "friendrequests",
      localField: "_id",
      foreignField: "from",
      as: "receivedRequest",
      pipeline: [{ $match: { to: { $eq: _id } } }],
    },
  },

  // add sender and receiver fields
  {
    $addFields: {
      isSender: { $first: "$sentRequest" },
      isReceiver: { $first: "$receivedRequest" },
    },
  },

  // select only these fields
  {
    $project: {
      uid: 1,
      name: 1,
      email: 1,
      photoURL: 1,
      isSender: 1,
      isReceiver: 1,
    },
  },
];

export const fetchUserInfo = wrapper(async (req, res) => {
  // throw error, if any, occurred in any middleware
  if (req.error) throw req.error;

  // uid is needed to process request
  if (!req.user?.uid) {
    throw new ApiError(401, "auth/invalid-access-token");
  }

  // find user in db
  let user = await User.findOne({ uid: req.user.uid }).populate("friends","uid name email photoURL");

  // uid not found, create new user
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
    throw new ApiError(401, "auth/invalid-access-token");
  }

  // get query value
  const { query } = req.query;

  // minimum 3 characters to search
  if (!query || query.length < 3)
    throw new ApiError(400, "request/invalid-query-length");

  let users = await User.aggregate(searchPipeline(req.user._id, query));

  return res.status(200).send(new ApiResponse(200, users, "get/users"));
});

export const newFriendRequest = wrapper(async (req, res) => {
  // throw error, if any, occurred in any middleware
  if (req.error) throw req.error;

  // uid is needed to process request
  if (!req.user?._id) {
    throw new ApiError(401, "auth/invalid-access-token");
  }

  // receiver id is needed
  if (!req.body.receiverId) throw new ApiError(400, "request/missing-body");

  const newRequest = await FriendRequest.create({
    from: req.user._id,
    to: req.body.receiverId,
  });

  res
    .status(201)
    .send(new ApiResponse(201, newRequest, "post/new-friend-request"));
});

export const cancelFriendRequest = wrapper(async (req, res) => {
  // throw error, if any, occurred in any middleware
  if (req.error) throw req.error;

  // uid is needed to process request
  if (!req.user?._id) {
    throw new ApiError(401, "auth/invalid-access-token");
  }

  if (!req.params.id) throw new ApiError(400, "request/missing-parameters");

  await FriendRequest.findByIdAndDelete(req.params.id);

  res
    .status(200)
    .send(new ApiResponse(200, null, "request/cancel-friend-request"));
});

export const acceptFriendRequest = wrapper(async (req, res) => {
  // throw error, if any, occurred in any middleware
  if (req.error) throw req.error;

  // uid is needed to process request
  if (!req.user?._id) {
    throw new ApiError(401, "auth/invalid-access-token");
  }

  const friendRequest = req.body.friendRequest;
  if (
    !friendRequest ||
    !friendRequest._id ||
    !friendRequest.from ||
    req.user._id.toString() !== friendRequest.to
  )
    throw new ApiError(400, "auth/unauthorized");

  // add to current user friends
  await User.updateOne(
    { _id: req.user._id },
    {
      $push: {
        friends: friendRequest.from,
      },
    }
  );

  // add to the request sender friends
  await User.updateOne(
    { _id: friendRequest.from },
    {
      $push: {
        friends: req.user._id,
      },
    }
  );

  // delete friend request
  await FriendRequest.findByIdAndDelete(friendRequest._id);

  res
    .status(200)
    .send(new ApiResponse(200, {}, "request/accept-friend-request"));
});
