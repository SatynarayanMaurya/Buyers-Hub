import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import {PrismaClient} from "../generated/prisma/index.js"
import { loginSchema,signupSchema } from "../validation/authValidation.js";

const prisma = new PrismaClient();

// 👉 Signup
export const signup = async (req, res) => {
  try {
    const result = signupSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({message:result.error.issues });
    }
    const { fullName, email, phone, password } = req.body;

    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check existing
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { phone }] },
    });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create
    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        phone,
        password: hashedPassword,
        role:  "agent",
      },
    });

    res.status(201).json({ message: "Signup successful", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// 👉 Login



export const login = async (req, res) => {
  try {
      const result = loginSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: result.error.issues });
      }
    const { emailOrPhone, password } = req.body;

    if (!emailOrPhone || !password) {
      return res.status(400).json({ message: "Email/Phone and password required" });
    }


    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: emailOrPhone }, { phone: emailOrPhone }],
      },
    });


    if (!user) {
      return res.status(400).json({ message: "User is not registered" });
    }

    const {password:_,...userDetails} = user;
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }


    // Generate JWT
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const isProduction = process.env.NODE_ENV === "production"
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    }

    res.cookie("token",token,cookieOptions).status(200).json({ message: "Login successful", token, userDetails });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message:error.message|| "Server error" });
  }
};
