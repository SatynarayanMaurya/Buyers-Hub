import { PrismaClient } from "../generated/prisma/index.js";
const prisma = new PrismaClient();

// Create Buyer
export const createBuyer = async (req, res) => {
  try {
    const { fullName, phone, propertyType, bhk, ...rest } = req.body;
    
    // Basic validations
    if (fullName.length < 2) return res.status(400).json({ error: "Name too short" });
    if (!/^\d{10,15}$/.test(phone)) return res.status(400).json({ error: "Invalid phone" });
    if (["Apartment", "Villa"].includes(propertyType) && !bhk)
      return res.status(400).json({ error: "BHK required for Apartment/Villa" });

    const buyer = await prisma.buyer.create({
      data: {
        ...req.body,
        ownerId: req.user.id, // from auth middleware
      },
    });

    // history entry
    await prisma.buyerHistory.create({
      data: {
        buyerId: buyer.id,
        changedBy: req.user.id,
        diff: { created: buyer },
      },
    });

    res.json(buyer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
