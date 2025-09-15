// src/controllers/importController.js
import { PrismaClient } from "../generated/prisma/index.js";
import { parse } from "csv-parse/sync";
import fs from "fs";
import path from "path";
import { csvHeaders, csvRowSchema } from "../validation/validators.js";

const prisma = new PrismaClient();

export const importBuyers = async (req, res) => {
  try {
    // multer stores file in req.file
    if (!req.file) {
      return res.status(400).json({ message: "CSV file required (field name: file)" });
    }

    // read file buffer (multer gives buffer if storage memory)
    const csvBuffer = req.file.buffer;
    const text = csvBuffer.toString("utf8");

    // parse CSV synchronously - returns array of objects if columns: true
    const records = parse(text, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });

    // check header keys (first record keys)
    const headerKeys = Object.keys(records[0] || {});
    const missing = csvHeaders.filter(h => !headerKeys.includes(h));
    if (missing.length > 0) {
      return res.status(400).json({ message: "Invalid CSV headers", missing });
    }

    // enforce max rows
    if (records.length === 0) {
      return res.status(400).json({ message: "CSV contains no rows" });
    }
    if (records.length > 200) {
      return res.status(400).json({ message: "CSV exceeds max 200 rows", rowCount: records.length });
    }

    const errors = [];
    const validRows = [];

    // validate each row
    for (let i = 0; i < records.length; i++) {
      const row = records[i];

      // Zod validation
      const result = csvRowSchema.safeParse(row);
      if (!result.success) {
        const formatted = result.error.errors.map(e => `${e.path.join(".") || "row"}: ${e.message}`).join("; ");
        errors.push({ row: i + 1, message: formatted });
        continue;
      }
      // attach validated data
      validRows.push(result.data);
    }

    // if any errors, return them (do not insert)
    if (errors.length > 0) {
      return res.status(400).json({ message: "Validation errors in CSV", errors });
    }

    // Now insert all validRows in a single transaction
    // We will create buyer + buyerHistory for each
    const userId = req.user && req.user.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Build create operations
    const ops = validRows.map(row => {
      return prisma.buyer.create({
        data: {
          fullName: row.fullName,
          email: row.email || null,
          phone: row.phone,
          city: row.city,
          propertyType: row.propertyType,
          bhk: row.bhk || null,
          purpose: row.purpose,
          budgetMin: row.budgetMin ?? null,
          budgetMax: row.budgetMax ?? null,
          timeline: row.timeline,
          source: row.source,
          notes: row.notes ?? null,
          tags: row.tags ?? [],
          status: row.status ?? "New",
          ownerId: userId,
        }
      });
    });

    // Run transaction
    const insertedBuyers = await prisma.$transaction(ops);

    // For each inserted buyer create a buyerHistory entry
    const historyOps = insertedBuyers.map(buyer => {
      return prisma.buyerHistory.create({
        data: {
          buyerId: buyer.id,
          changedBy: userId,
          diff: { created: buyer }
        }
      });
    });

    await prisma.$transaction(historyOps);

    return res.status(201).json({
      message: `Imported ${insertedBuyers.length} buyers successfully`,
      inserted: insertedBuyers.length
    });

  } catch (err) {
    console.error("Import error:", err);
    return res.status(500).json({ message: "CSV import failed" });
  }
};
