import mongoose, { Model, Schema } from "mongoose";
import type { IMessage } from "../types/IMessage.js";

const messageSchema = new Schema<IMessage>(
  {
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String },
    image: { type: String },
    seen: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Message:Model<IMessage> = mongoose.model<IMessage>("Message", messageSchema);

export default Message;
