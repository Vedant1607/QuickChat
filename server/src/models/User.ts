import mongoose, { Document, Model, Schema } from "mongoose";
import type { IUser } from "../types/IUser.js";

const userSchema: Schema<IUser> = new Schema(
  {
    email: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    password: { type: String, required: true, minLength: 6 },
    profilePic: { type: String, default: "" },
    bio: { type: String },
  },
  { timestamps: true }
);

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;
