import jwt, { type JwtPayload, type SignOptions } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

export interface TokenPayload extends JwtPayload {
  userId: string;
}

export const generateToken = (userId: string): string => {
  const options: SignOptions = {
    expiresIn: "7d",
  };
  return jwt.sign({ userId }, JWT_SECRET, options);
};

export const verifyToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};
