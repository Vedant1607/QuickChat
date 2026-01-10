import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import { Toaster } from "react-hot-toast";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const App = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("App must be used within AuthProvider");
  }

  const { authUser } = authContext;

  const isAuthenticated = Boolean(authUser);

  return (
    <div className="bg-[url('/bgImage.svg')] bg-contain min-h-screen">
      <Toaster />
      <Routes>
        <Route path="/" element={isAuthenticated ? <HomePage/> : <Navigate to={"/login"} replace />}/>
        <Route path="/login" element={!isAuthenticated ? <LoginPage/> : <Navigate to={"/"} replace />}/>
        <Route path="/profile" element={isAuthenticated ? <ProfilePage/> : <Navigate to={"/login"} replace />}/>
      </Routes>
    </div>
  );
};

export default App;
