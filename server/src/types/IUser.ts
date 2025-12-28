import { Document } from "mongoose";

export interface IUser extends Document {
  fullName: string;
  password: string;
  email: string;
  bio?: string;
  profilePic?: string;
}