// validation/userSchemas.js
import { z } from "zod";

// Signup validation

export const signupSchema = z.object({
  fullName: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email"),
  phone: z
    .string()
    .min(10, "Phone must be at least 10 digits")
    .max(15, "Phone can't exceed 15 digits")
    .optional(), // ✅ phone is optional now
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
  emailOrPhone: z.string().refine(
    (val) => {
      const isEmail = z.string().email().safeParse(val).success;
      const isPhone = /^\d{10,15}$/.test(val); // phone 10–15 digits
      return isEmail || isPhone;
    },
    {
      message: "Enter a valid email or phone number",
    }
  ),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
