import { createContext, useEffect, useState } from "react";
import axios from 'axios';
import toast from "react-hot-toast";

export const AuthContext = createContext();

const backendUrl = import.meta.env.VITE_BACKEND_URL;
if (!backendUrl) {
  throw new Error("VITE_BACKEND_URL is not defined");
}

axios.defaults.baseURL = backendUrl;

export const AuthProvider = ({ children }) => {

    const [token, setToken] = useState(localStorage.getItem("token"));
    const [authUser, setAuthUser] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [socket, setSocket] = useState(null);

    // Check if user is authenticated and if so, set the user data and connect the socket
    const checkAuth = async () => {
        try {
            const {data} = await axios.get("/api/auth/check");
            if(data.success) {
                setAuthUser(data.user);
            }
        } catch (err) {
            toast.error(err.message)
            console.error(err);
        }
    }

    useEffect(() => {
        if(token) {
            axios.defaults.headers.common.Authorization = token;
        }
        checkAuth();
    }, [])

    const value = {
        axios,
        authUser,
        onlineUsers,
        socket
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}