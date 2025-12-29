import type { Request, Response } from "express";
import User from "../models/User.js";
import Message from "../models/Message.js";
import { Types } from "mongoose";

// Get all users except the logged in user
export const getUsersForSidebar = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    const filteredUser = await User.find({ _id: { $ne: userId } }).select(
      "-password"
    );

    // Count number of messages not seen
    const unseenMessages: Record<string, number> = {};
    const promises = filteredUser.map(async (user) => {
      const messages = await Message.find({
        senderId: user._id,
        receiverId: userId,
        seen: false,
      });
      if (messages.length > 0) {
        unseenMessages[user._id.toString()] = messages.length;
      }
    });
    await Promise.all(promises);
    return res.status(200).json({
      success: true,
      users: filteredUser,
      unseenMessages,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: err instanceof Error ? err.message : "Internal Server Error",
    });
  }
};

// Get all messages for selected user
export const getMessages = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const selectedUserId = new Types.ObjectId(id);
    const myId = new Types.ObjectId(req.user._id);

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: selectedUserId },
        { senderId: selectedUserId, receiverId: myId },
      ],
    }).sort({ createdAt: 1 });

    await Message.updateMany(
      { senderId: selectedUserId, receiverId: myId },
      { seen: true }
    );

    return res.status(200).json({
      success: true,
      messages,
    });
  } catch (err) {
    console.error("Get messages error:", err);
    return res.status(500).json({
      success: false,
      message: err instanceof Error ? err.message : "Internal Server Error",
    });
  }
};
