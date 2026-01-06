import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";
import api from "../src/lib/axios";

interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  content: string;
  seen: boolean;
  createdAt: string;
}

interface User {
  _id: string;
  fullName: string;
  email: string;
}

interface ChatContextType {
  messages: Message[];
  users: User[];
  selectedUser: User | null;
  unseenMessages: Record<string, number>;
  setSelectedUser: (user: User | null) => void;
  getUsers: () => Promise<void>;
  getMessages: (userId: string) => Promise<void>;
  sendMessage: (messageData: unknown) => Promise<void>;
  setUnseenMessages: React.Dispatch<
    React.SetStateAction<Record<string, number>>
  >;
}

export const ChatContext = createContext<ChatContextType | null>(null);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [unseenMessages, setUnseenMessages] = useState<Record<string, number>>(
    {}
  );

  const authContext = useContext(AuthContext);
  const socket = authContext?.socket;

  // Function to get all users for sidebar
  const getUsers = useCallback(async () => {
    try {
      const { data } = await api.get("/api/messages/users");
      if (data.success) {
        setUsers(data.users);
        setUnseenMessages(data.unseenMessages);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to load users");
    }
  }, []);

  // Function to get messages for selected user
  const getMessages = useCallback(async (userId: string) => {
    if (!userId) return;

    try {
      const { data } = await api.get(`/api/messages/${userId}`);
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to fetch messages");
    }
  }, []);

  // Function to send message to selected user
  const sendMessage = useCallback(
    async (messageData: unknown) => {
      if (!selectedUser?._id) return;
      try {
        const { data } = await api.post(
          `/api/messages/send/${selectedUser._id}`,
          messageData
        );
        if (!data.success) {
          toast.error(data.message);
          return;
        }
        setMessages((prev) => [...prev, data.newMessage]);
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "Failed to send message");
      }
    },
    [selectedUser]
  );

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = async (newMessage: Message) => {
      if (selectedUser && newMessage.senderId === selectedUser._id) {
        newMessage.seen = true;
        setMessages((prev) => [...prev, newMessage]);

        try {
          await api.put(`/api/messages/mark/${newMessage._id}`);
        } catch {
          console.error("Failed to mark message as seen");
        }
      } else {
        setUnseenMessages((prev) => ({
          ...prev,
          [newMessage.senderId]: (prev[newMessage.senderId] || 0) + 1,
        }));
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, selectedUser]);

  const value = useMemo<ChatContextType>(
    () => ({
      messages,
      users,
      selectedUser,
      setSelectedUser,
      getUsers,
      getMessages,
      sendMessage,
      unseenMessages,
      setUnseenMessages,
    }),
    [
      messages,
      users,
      selectedUser,
      unseenMessages,
      getUsers,
      getMessages,
      sendMessage,
    ]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
