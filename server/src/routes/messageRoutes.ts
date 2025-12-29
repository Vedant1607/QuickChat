import express from "express";
import { protectRoute } from "../middleware/auth.js";
import { getMessages, getUsersForSidebar, markMessageAsSeen } from "../controllers/messageController.js";

const messageRouter = express.Router();

// Get users for sidebar
messageRouter.get("/user", protectRoute, getUsersForSidebar);

// Get messages with a specific user
messageRouter.get("/:id", protectRoute, getMessages);

// Mark message as seen
messageRouter.put("/mark/:id", protectRoute, markMessageAsSeen);

export default messageRouter;