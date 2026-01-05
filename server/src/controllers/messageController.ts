import type { Request, Response } from "express";
import User from "../models/User.js";
import Message from "../models/Message.js";
import mongoose, { Types } from "mongoose";
import cloudinary from "../lib/cloudinary.js";
import { io, userSocketMap } from "../server.js";

// Get all users except the logged in user
export const getUsersForSidebar = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
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

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const selectedUserId = id;
    const myId = req.user._id;

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

// api to mark message as seen using message id
export const markMessageAsSeen = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    const { id } = req.params;
    if (!id || !Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid message ID",
      });
    }

    await Message.findByIdAndUpdate(id, { seen: true });
    return res.status(200).json({
      success: true,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: err instanceof Error ? err.message : "Internal Server Error",
    });
  }
};

// Send message to selected user
export const sendMessage = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { text, image } = req.body;
    const receiverId = new Types.ObjectId(req.params.id);
    const senderId = new Types.ObjectId(req.user._id);

    let imageUrl: string | undefined;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const messageData: {
      senderId: Types.ObjectId;
      receiverId: Types.ObjectId;
      text?: string;
      image?: string;
    } = {
      senderId,
      receiverId,
    };

    if (text) {
      messageData.text = text;
    }

    if (imageUrl) {
      messageData.image = imageUrl;
    }

    const newMessage = await Message.create(messageData);

    // Emit the new message to the receiver's socket
    const receiverSocketId = userSocketMap[receiverId.toString()];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json({
      success: true,
      newMessage,
    });
  } catch (err) {
    console.error("Send message error:", err);
    res.status(500).json({
      success: false,
      message: err instanceof Error ? err.message : "Internal Server Error",
    });
  }
};
