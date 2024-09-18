import ApiError from "../classes/ApiError.class.js";
import ApiResponse from "../classes/ApiResponse.class.js";
import { Chat } from "../models/chat.model.js";
import { User } from "../models/user.model.js";
import { wrapper } from "../utils/requestWrapper.js";

export const getChatId = wrapper(async (req, res) => {
  // throw error, if any, occurred in any middleware
  if (req.error) throw req.error;

  const { _id: myId } = req.user;
  const { userId: friendId } = req.query;

  // id is needed to process request
  if (!myId) {
    throw new ApiError(401, "auth/invalid-access-token");
  }

  // chat with who?
  if (!friendId) {
    throw new ApiError(400, "auth/missing-data");
  }

  // find so called "friend"
  const friend = await User.findById(friendId);

  // friend account not found
  if (!friend) {
    throw new ApiError(404, "request/user-not-found");
  }

  // not a friend?
  else if (!friend.friends.includes(myId)) {
    throw new ApiError(403, "request/access-denied");
  }

  // find if chat exists
  let chatid = await Chat.findOne({
    isGroupChat: false,
    users: {
      $all: [myId, friendId],
    },
  });

  // create new chat if not found
  if (!chatid) {
    chatid = await new Chat({
      isGroupChat: false,
      name: myId + "." + friendId,
      users: [myId, friendId],
      admin: myId,
    }).save();
  }
  return res.status(200).send(new ApiResponse(200, chatid._id, "get/chat-id"));
});

export const getChatInfo = wrapper(async (req, res) => {
  // throw error, if any, occurred in any middleware
  if (req.error) throw req.error;

  const { _id: myId } = req.user;
  const { chatId } = req.query;

  // id is needed to process request
  if (!req.user?._id) {
    throw new ApiError(401, "auth/invalid-access-token");
  }

  // chat id is required
  if (!chatId) {
    throw new ApiError(401, "auth/invalid-chat-id");
  }

  // find chat by id
  let chat = await Chat.findById(chatId);

  // chat not found
  if (!chat) {
    throw new ApiError(404, "request/chat-not-found");
  }

  // make sure current user is part of chat
  if (!chat.users.includes(myId)) {
    throw new ApiError(401, "user/access-denied");
  }

  // populate data
  await chat.populate("users", 'uid name email photoURL')

  res.status(200).send(new ApiResponse(200, chat, "get/chat-by-id"));
});
