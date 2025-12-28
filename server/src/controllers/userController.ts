import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { generateToken } from "../lib/utils.js";
import type { Request, Response } from "express";
import { signinSchema, signupSchema } from "../validators/auth.schema.js";
import { ZodError } from "zod";
import cloudinary from "../lib/cloudinary.js";
import type { IUser } from "../types/IUser.js";

// Signup a new user
export const signup = async (req: Request, res: Response) => {
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
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        bio: newUser.bio,
      },
      token,
      message: "Account Created Successfully",
    });
  } catch (err: unknown) {
    if (err instanceof ZodError) {
      return res.status(400).json({
        success: false,
        errors: err.issues.map((e) => ({
          field: e.path[0],
          message: e.message,
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

// Signin user
export const login = async (req: Request, res: Response) => {
  try {
    const parsed = signinSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid input data",
        erros: parsed.error.flatten().fieldErrors,
      });
    }
    const { email, password } = parsed.data;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user?.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    const token = generateToken(user._id.toString());
    const { password: _, ...safeUser } = user.toObject();

    res.status(200).json({
      success: true,
      userData: safeUser,
      token,
      message: "Login successful",
    });
  } catch (err) {
    console.error("Login error: ", err);
    if (err instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: err.flatten().fieldErrors,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Controller to check if user is authenticated
export const checkAuth = (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  return res.status(200).json({
    success: true,
    user: req.user,
  });
};

// Controller to update user profile details
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { profilePic, bio, fullName } = req.body;
    const userId = req.user._id;

    let updateData: Record<string, unknown> = { bio, fullName };

    if (profilePic) {
      const upload = await cloudinary.uploader.upload(profilePic);
      updateData.profilePic = upload.secure_url;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    }).select("-password");

    return res.status(200).json({
      success: true,
      user: updatedUser,
    });
  } catch (err) {
    console.error("Update profile error: ", err);
    return res.status(500).json({
      success: false,
      message: err instanceof Error ? err.message : "Internal Server Error",
    });
  }
};
