import type { Request, Response } from "express";
import User from "../models/User.js";
import Message from "../models/Message.js";

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
