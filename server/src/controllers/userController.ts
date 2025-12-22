import bcrypt from "bcryptjs";
import User, { type IUser } from "../models/User.js";
import { generateToken } from "../lib/utils.js";
import type { Request, Response } from "express";
import { signupSchema } from "../validators/auth.schema.js";
import { ZodError } from "zod";

export const signup = async (
  req: Request,
  res: Response
) => {
  const { fullName, email, password, bio } = req.body;

  try {
    const validateData = signupSchema.parse(req.body);
    const { fullName, email, password, bio } = validateData;

    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(409)
        .json({ success: false, message: "Account already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser: IUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      bio,
    });
    const token = generateToken(newUser._id.toString());
    res.status(201).json({
      success: true,
      userData: {
        _id:newUser._id,
        fullName:newUser.fullName,
        email:newUser.email,
        bio:newUser.bio,
      },
      token,
      message: "Account Created Successfully",
    });
  } catch (err: unknown) {
    if (err instanceof ZodError) {
      return res.status(400).json({
        success: false,
        errors: err.issues.map(e => ({
          field:e.path[0],
          message:e.message,
        })),
      });
    }

    console.error("Signup Error:", err);
    res.status(500).json({
      success: false,
      message: err instanceof Error ? err.message : "Internal Server Error",
    });
  }
};
