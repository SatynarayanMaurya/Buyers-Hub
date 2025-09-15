import { PrismaClient } from "../generated/prisma/index.js";
import { Parser } from "json2csv";

const prisma = new PrismaClient();

export const exportBuyers = async (req, res) => {
  try {
    const { city, propertyType, status, timeline, search, sortBy, order } = req.query;

    let where = {};

    if (city) where.city = city;
    if (propertyType) where.propertyType = propertyType;
    if (status) where.status = status;
    if (timeline) where.timeline = timeline;

    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: "insensitive" } },
        { phone: { contains: search } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    const buyers = await prisma.buyer.findMany({
      where,
      orderBy: { [sortBy || "updatedAt"]: order || "desc" },
    });

    if (!buyers.length) {
      return res.status(404).json({ message: "No buyers found for export" });
    }

    const fields = [
      "fullName",
      "email",
      "phone",
      "city",
      "propertyType",
      "bhk",
      "purpose",
      "budgetMin",
      "budgetMax",
      "timeline",
      "source",
      "notes",
      "tags",
      "status",
      "updatedAt",
    ];

    const parser = new Parser({ fields });
    const csv = parser.parse(buyers);

    res.header("Content-Type", "text/csv");
    res.attachment("buyers_export.csv");
    res.send(csv);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "CSV export failed" });
  }
};
