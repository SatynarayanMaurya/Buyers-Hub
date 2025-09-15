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


export const getBuyers = async (req, res) => {
  try {
    const page = parseInt(req.query.q) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    const skip = (page - 1) * pageSize;

    const buyers = await prisma.buyer.findMany({
      skip,
      take: pageSize,
      orderBy: { updatedAt: "desc" },
    });

    const totalCount = await prisma.buyer.count();

    res.status(200).json({
      buyers,
      pagination: {
        page,
        pageSize,
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
      },
    });
  } catch (error) {
    console.error("Error fetching buyers:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

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

// export const updateBuyer = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const data = req.body;

//     const buyer = await prisma.buyer.update({
//       where: { id },
//       data,
//     });

//     res.status(200).json({ message: "Buyer updated successfully", buyer });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };


// PUT /buyers/:id
export const updateBuyer = async (req, res) => {
  try {
    const { id } = req.params;
    const { updatedAt, ...data } = req.body; // frontend should send updatedAt hidden input
    const userId = req.user?.id || "system"; // track who updated

    // 1. Find existing buyer
    const existingBuyer = await prisma.buyer.findUnique({
      where: { id },
    });

    if (!existingBuyer) {
      return res.status(404).json({ message: "Buyer not found" });
    }

    const diff = {};
    for (const key of Object.keys(data)) {
      if (data[key] !== existingBuyer[key]) {
        diff[key] = { old: existingBuyer[key], new: data[key] };
      }
    }

    if (Object.keys(diff).length === 0) {
      return res.status(200).json({ message: "No changes detected" });
    }

    // 4. Run update + history log in a transaction
    const [updatedBuyer, history] = await prisma.$transaction([
      prisma.buyer.update({
        where: { id },
        data,
      }),
      prisma.buyerHistory.create({
        data: {
          buyerId: existingBuyer.id,
          changedBy: userId,
          diff,
        },
      }),
    ]);

    res.status(200).json({
      message: "Buyer updated successfully",
      buyer: updatedBuyer,
      history,
    });
  } catch (error) {
    console.error("Update Buyer Error:", error);
    res.status(500).json({ message: error.message || "Server error" });
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


// GET /buyers/:id/history
export const getBuyerHistory = async (req, res) => {
  try {
    const { id } = req.params;

    const history = await prisma.buyerHistory.findMany({
      where: { buyerId: id },
      orderBy: { changedAt: "desc" },
      take: 5,
    });

    res.status(200).json({ history });
  } catch (error) {
    console.error("Get Buyer History Error:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};
