import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

// Create Buyer
export const createBuyer = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      city,
      propertyType,
      bhk,
      purpose,
      budgetMin,
      budgetMax,
      timeline,
      source,
      status,
      notes,
      tags,
    } = req.body;



    if (!fullName || !phone || !city || !propertyType || !purpose || !timeline || !source) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const buyer = await prisma.buyer.create({
      data: {
        fullName,
        email,
        phone,
        city,
        propertyType,
        bhk,
        purpose,
        budgetMin:Number(budgetMin),
        budgetMax:Number(budgetMax),
        timeline,
        source,
        status,
        notes,
        tags,
        ownerId: req.user.id, // from authMiddleware
      },
    });

    res.status(201).json({ message: "Buyer created successfully", buyer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message:error?.message || "Server error" });
  }
};

// Get all Buyers (with filters later)
export const getBuyers = async (req, res) => {
  try {
    const buyers = await prisma.buyer.findMany({
      orderBy: { updatedAt: "desc" },
    });
    res.status(200).json({allBuyers:buyers});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message:error.message ||  "Server error" });
  }
};

// Get Buyer by ID
export const getBuyerById = async (req, res) => {
  try {
    const { id } = req.params;
    const buyer = await prisma.buyer.findUnique({ where: { id } });
    if (!buyer) return res.status(404).json({ message: "Buyer not found" });
    res.status(200).json(buyer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update Buyer
export const updateBuyer = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const buyer = await prisma.buyer.update({
      where: { id },
      data,
    });

    res.status(200).json({ message: "Buyer updated successfully", buyer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete Buyer
export const deleteBuyer = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.buyer.delete({ where: { id } });

    res.status(200).json({ message: "Buyer deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
