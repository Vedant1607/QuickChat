import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import toast from "react-hot-toast";
import { io, Socket } from "socket.io-client";
import api, { setAuthToken } from "../src/lib/axios";
import type { User } from "../src/types/user";

interface AuthContextType {
  authUser: User | null;
  onlineUsers: string[];
  socket: Socket | null;
  login: (state: string, credentials: unknown) => Promise<void>;
  logout: () => void;
  updateProfile: (body: unknown) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const socketRef = useRef<Socket | null>(null);

  const token = useMemo(() => localStorage.getItem("token"), []);

  /* ---------------------- */
  /* Socket */
  /* ---------------------- */

  const connectSocket = useCallback((user: User) => {
    if (!user || socketRef.current?.connected) return;

    const socket = io(api.defaults.baseURL!, {
      query: { userId: user._id },
    });

    socket.on("getOnlineUsers", (users: string[]) => {
      setOnlineUsers(users);
    });

    socketRef.current = socket;
  }, []);

  const disconnectSocket = useCallback(() => {
    socketRef.current?.disconnect();
    socketRef.current = null;
    setOnlineUsers([]);
  }, []);

  // Check if user is authenticated and if so, set the user data and connect the socket
  const checkAuth = useCallback(async () => {
    try {
      const { data } = await api.get("/api/auth/check");
      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user);
      }
    } catch (err) {
      logout();
    }
  }, [connectSocket]);

  // Login function to handle user authentication and socket connection
  const login = useCallback(
    async (state: string, credentials: unknown) => {
      try {
        const { data } = await api.post(`/api/auth/${state}`, credentials);
        if (!data.success) {
          toast.error(data.message);
          return;
        }

        setAuthUser(data.userData);
        setAuthToken(data.token);
        localStorage.setItem("token", data.token);

        connectSocket(data.userData);
        toast.success(data.message);
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "Login failed");
      }
    },
    [connectSocket]
  );

  // Logout function to handle user logout and socket disconnection
  const logout = useCallback(async () => {
    localStorage.removeItem("token");
    setAuthToken(null);
    setAuthUser(null);
    disconnectSocket();
    toast.success("Logged out successfully");
  }, [disconnectSocket]);

  // Update profile function to handle user profile updates
  const updateProfile = useCallback(async (body: unknown) => {
    try {
      const { data } = await api.put("/api/auth/update-profile", body);
      if (data.success) {
        setAuthUser(data.user);
        toast.success("Profile updated successfully");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Update failed");
    }
  }, []);

  useEffect(() => {
    if (!token) return;
    setAuthToken(token);
    checkAuth();

    return () => disconnectSocket();
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      authUser,
      onlineUsers,
      socket: socketRef.current,
      login,
      logout,
      updateProfile,
    }),
    [authUser, onlineUsers, login, updateProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
