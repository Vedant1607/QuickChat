import { useContext, useEffect, useRef, useState, useCallback } from "react";
import toast from "react-hot-toast";

import assets from "../assets/assets";
import { formatMessageTime } from "../lib/utils";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";

/* ---------------------------------- */
/* Component */
/* ---------------------------------- */

const ChatContainer = () => {
  const chatContext = useContext(ChatContext);
  const authContext = useContext(AuthContext);

  if (!chatContext || !authContext) {
    throw new Error("ChatContainer must be used within providers");
  }

  const {
    messages,
    selectedUser,
    setSelectedUser,
    sendMessage,
    getMessages,
  } = chatContext;

  const { authUser, onlineUsers } = authContext;

  const scrollEndRef = useRef<HTMLDivElement | null>(null);
  const [input, setInput] = useState("");

  /* ---------------------------------- */
  /* Handlers */
  /* ---------------------------------- */

  const handleSendMessage = useCallback(
    async () => {
      if (!input.trim()) return;

      await sendMessage({ text: input.trim() });
      setInput("");
    },
    [input, sendMessage]
  );

  const handleSendImage = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];

      if (!file || !file.type.startsWith("image/")) {
        toast.error("Select a valid image file");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = async () => {
        await sendMessage({ image: reader.result });
        e.target.value = "";
      };

      reader.readAsDataURL(file);
    },
    [sendMessage]
  );

  /* ---------------------------------- */
  /* Effects */
  /* ---------------------------------- */

  useEffect(() => {
    if (!selectedUser?._id) return;
    getMessages(selectedUser._id);
  }, [selectedUser?._id, getMessages]);

  useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ---------------------------------- */
  /* UI */
  /* ---------------------------------- */

  if (!selectedUser) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden">
        <img src={assets.logo_icon} alt="" className="max-w-16" />
        <p className="text-lg font-medium text-white">
          Chat anytime, anywhere
        </p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-scroll relative backdrop-blur-lg">
      {/* ---------- HEADER ---------- */}
      <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">
        <img
          src={selectedUser.profilePic || assets.avatar_icon}
          alt=""
          className="w-8 rounded-full"
        />

        <p className="flex-1 text-lg text-white flex items-center gap-2">
          {selectedUser.fullName}
          {onlineUsers.includes(selectedUser._id) && (
            <span className="w-2 h-2 rounded-full bg-green-500" />
          )}
        </p>

        <img
          onClick={() => setSelectedUser(null)}
          src={assets.arrow_icon}
          alt=""
          className="md:hidden max-w-7 cursor-pointer"
        />

        <img
          src={assets.help_icon}
          alt=""
          className="max-md:hidden max-w-5"
        />
      </div>

      {/* ---------- CHAT AREA ---------- */}
      <div className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6">
        {messages.map((msg) => {
          const isOwnMessage = msg.senderId === authUser?._id;

          return (
            <div
              key={msg._id}
              className={`flex items-end gap-2 ${
                isOwnMessage ? "flex-row-reverse" : "justify-start"
              }`}
            >
              {msg.image ? (
                <img
                  src={msg.image}
                  alt=""
                  className="max-w-[230px] border border-gray-700 rounded-lg mb-8"
                />
              ) : (
                <p
                  className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 bg-violet-500/30 text-white ${
                    isOwnMessage ? "rounded-br-none" : "rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </p>
              )}

              <div className="text-center text-xs">
                <img
                  src={
                    isOwnMessage
                      ? authUser?.profilePic || assets.avatar_icon
                      : selectedUser.profilePic || assets.avatar_icon
                  }
                  alt=""
                  className="w-7 rounded-full"
                />
                <p className="text-gray-500">
                  {formatMessageTime(msg.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={scrollEndRef} />
      </div>

      {/* ---------- INPUT AREA ---------- */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3">
        <div className="flex-1 flex items-center bg-gray-100/10 px-3 rounded-full">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            type="text"
            placeholder="Send a message"
            className="flex-1 text-sm p-3 border-none outline-none text-white placeholder-gray-400 bg-transparent"
          />

          <input
            id="image"
            type="file"
            accept="image/png, image/jpeg"
            hidden
            onChange={handleSendImage}
          />

          <label htmlFor="image">
            <img
              src={assets.gallery_icon}
              alt=""
              className="w-5 mr-2 cursor-pointer"
            />
          </label>
        </div>

        <img
          onClick={handleSendMessage}
          src={assets.send_button}
          alt=""
          className="w-7 cursor-pointer"
        />
      </div>
    </div>
  );
};

export default ChatContainer;
