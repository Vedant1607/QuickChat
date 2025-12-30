import { createContext } from "react";
import axios from 'axios';

export const AuthContext = createContext();

const backendUrl = import.meta.env.VITE_BACKEND_URL;
if (!backendUrl) {
  throw new Error("VITE_BACKEND_URL is not defined");
}

axios.defaults.baseURL = backendUrl;

export const AuthProvider = ({ children }) => {
    const value = {
        axios
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}