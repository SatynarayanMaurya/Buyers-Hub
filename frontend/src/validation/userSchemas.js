// validation/userSchemas.js
import { z } from "zod";

// Signup validation

export const signupSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email"),
  phone: z
    .string()
    .min(10, "Phone must be at least 10 digits")
    .max(15, "Phone can't exceed 15 digits")
    .optional(), // ✅ phone is optional now
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Login validation
export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
