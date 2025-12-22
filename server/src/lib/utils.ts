import jwt, { type SignOptions } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

export const generateToken = (userId: string): string => {
  const options: SignOptions = {
    expiresIn: "7d",
  };
  return jwt.sign({ userId }, JWT_SECRET, options);
};
