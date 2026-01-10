import { useContext } from "react";
import ChatContainer from "../components/ChatContainer";
import RightSidebar from "../components/RightSidebar";
import Sidebar from "../components/Sidebar";
import { ChatContext } from "../../context/ChatContext";

const HomePage = () => {
  const chatContext = useContext(ChatContext);

  if (!chatContext) {
    throw new Error("Homepage must be used within a ChatProvider");
  }
  const { selectedUser } = chatContext;

  const gridLayout = selectedUser
    ? "md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]"
    : "md:grid-cols-2";

  return (
    <div className="w-full h-screen sm:px-[15%] sm:py-[5%]">
      <div
        className={`relative h-full grid grid-cols-1 overflow-hidden rounded-2xl border-2 border-gray-600 backdrop-blur-xl ${gridLayout}`}
      >
        <Sidebar />
        <ChatContainer />
        <RightSidebar />
      </div>
    </div>
  );
};

export default HomePage;
