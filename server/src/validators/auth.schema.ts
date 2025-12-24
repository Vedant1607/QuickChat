import z, { email } from "zod";

export const signupSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name is too short")
    .max(20, "Name cannot be more than 20 characters"),
  email: z.string().email("Invalid Email Address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password cannot be more than 20 characters"),
  bio: z.string(),
});

export const signinSchema = z.object({
  email: z.string().email("Invalid Email Address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password cannot be more than 20 characters"),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type SigninInput = z.infer<typeof signinSchema>;