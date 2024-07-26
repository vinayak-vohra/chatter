import mongoose from "mongoose";
import { UserRoles } from "../utils/enums.js";

const userSchema = new mongoose.Schema(
  {
    /// firebase user id
    uid: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    photoURL: {
      type: String,
    },

    role: {
      type: String,
      enum: Object.values(UserRoles),
      default: UserRoles.USER,
    },

    // to be implemented
    // - friendlist
    // - requestlist
    // - blocklist
    friends: [{ type: mongoose.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
