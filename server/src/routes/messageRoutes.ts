import express from "express";
import { protectRoute } from "../middleware/auth.js";
import { getMessages, getUsersForSidebar, markMessageAsSeen, sendMessage } from "../controllers/messageController.js";

const messageRouter = express.Router();

// Get users for sidebar
messageRouter.get("/users", protectRoute, getUsersForSidebar);

// Get messages with a specific user
messageRouter.get("/:id", protectRoute, getMessages);

// Mark message as seen
messageRouter.put("/mark/:id", protectRoute, markMessageAsSeen);

// Send message to other user
messageRouter.post("/send/:id", protectRoute, sendMessage);

export default messageRouter;