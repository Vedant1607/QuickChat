import { useContext, useEffect, useState } from "react";
import assets from "../assets/assets";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";

const RightSidebar = () => {
  const chatContext = useContext(ChatContext);
  const authContext = useContext(AuthContext);

  if (!chatContext || !authContext) return null;

  const { selectedUser, messages } = chatContext;
  const { logout, onlineUsers } = authContext;

  const [msgImages, setMsgImages] = useState<string[]>([]);

  // Get all the images from the messages and set them to state
  useEffect(() => {
    const images = messages
      .filter((msg) => msg.image)
      .map((msg) => msg.image as string);

    setMsgImages(images);
  }, [messages]);

  if (!selectedUser) return null;

  return (
    <div
      className={`bg-[#8185B2]/10 text-white w-full relative overflow-y-scroll max-md:hidden`}
    >
      <div className="pt-16 flex flex-col items-center gap-2 text-xs font-light">
        <img
          src={selectedUser?.profilePic || assets.avatar_icon}
          alt="profile"
          className="w-20 aspect-square rounded-full"
        />
        <h1 className="px-10 text-xl font-medium mx-auto flex items-center gap-2">
          {onlineUsers.includes(selectedUser._id) && (
            <span className="w-2 h-2 rounded-full bg-green-500" />
          )}
          {selectedUser.fullName}
        </h1>
        {selectedUser.bio && (
          <p className="px-10 mx-auto text-center opacity-80">{selectedUser.bio}</p>
        )}
      </div>

      <hr className="border-[#ffffff50] my-4" />

      <div className="px-5 text-xs">
        <p>Media</p>
        <div className="mt-2 max-h-[200px] overflow-y-scroll grid grid-cols-2 gap-5 opacity-80">
          {msgImages.map((url, index) => (
            <button
              key={index}
              onClick={() => window.open(url, "_blank")}
              className="cursor-pointer rounded"
            >
              <img src={url} alt="media" className="h-full rounded-md" />
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={logout}
        className="absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-linear-to-r from-purple-400 to-violet-600 text-white border-none text-sm font-light py-2 px-20 rounded-full cursor-pointer"
      >
        Logout
      </button>
    </div>
  );
};

export default RightSidebar;
