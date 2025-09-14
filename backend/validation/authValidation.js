
import {z} from "zod"

export const loginSchema = z.object({
  emailOrPhone: z.string().min(1, "Required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});


export const signupSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .regex(/^\d{10,15}$/, "Phone must be 10–15 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});