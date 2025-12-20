import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    mongoose.connection.on("connect", () => console.log("Database Connected"));
    await mongoose.connect(`${process.env.MONGODB_URI}/chat-app`);
  } catch (err) {
    console.error(err);
  }
};
