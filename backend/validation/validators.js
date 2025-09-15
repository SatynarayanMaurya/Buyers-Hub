// src/utils/validators.js
import { z } from "zod";

const CityEnum = z.enum(["Chandigarh", "Mohali", "Zirakpur", "Panchkula", "Other"]);
const PropertyTypeEnum = z.enum(["Apartment", "Villa", "Plot", "Office", "Retail"]);
const BHKEnum = z.enum(["1", "2", "3", "4", "Studio"]);
const PurposeEnum = z.enum(["Buy", "Rent"]);
const TimelineEnum = z.enum(["0-3m", "3-6m", ">6m", "Exploring"]);
const SourceEnum = z.enum(["Website", "Referral", "Walk-in", "Call", "Other"]);
const StatusEnum = z.enum(["New", "Qualified", "Contacted", "Visited", "Negotiation", "Converted", "Dropped"]);

export const csvHeaders = [
  "fullName", "email", "phone", "city", "propertyType", "bhk", "purpose",
  "budgetMin", "budgetMax", "timeline", "source", "notes", "tags", "status"
];

// schema expects raw string fields from CSV; we'll pre-process numbers & arrays
export const csvRowSchema = z.object({
  fullName: z.string().min(2, "fullName must be at least 2 characters"),
  email: z.string().email("Invalid email").optional()
    .or(z.literal(""))
    .transform(v => v === "" ? undefined : v)
    .optional(),
  phone: z.string().regex(/^\d{10,15}$/, "phone must be 10-15 digits"),
  city: CityEnum,
  propertyType: PropertyTypeEnum,
  bhk: z.string().optional()
    .or(z.literal(""))
    .transform(v => v === "" ? undefined : v)
    .optional(),
  purpose: PurposeEnum,
  budgetMin: z.preprocess((v) => {
    if (v === "" || v === null || v === undefined) return undefined;
    const n = Number(v);
    return Number.isNaN(n) ? v : Math.floor(n);
  }, z.number().int().positive().optional()),
  budgetMax: z.preprocess((v) => {
    if (v === "" || v === null || v === undefined) return undefined;
    const n = Number(v);
    return Number.isNaN(n) ? v : Math.floor(n);
  }, z.number().int().positive().optional()),
  timeline: TimelineEnum,
  source: SourceEnum,
  notes: z.string().max(1000).optional()
    .or(z.literal(""))
    .transform(v => v === "" ? undefined : v)
    .optional(),
  tags: z.string().optional().transform(v => {
    if (!v) return [];
    return v.split(",").map(t => t.trim()).filter(Boolean);
  }),
  status: StatusEnum.optional().default("New")
}).superRefine((data, ctx) => {
  // bhk required if propertyType is Apartment or Villa
  if (["Apartment", "Villa"].includes(data.propertyType)) {
    if (!data.bhk) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["bhk"],
        message: "bhk is required when propertyType is Apartment or Villa"
      });
    } else {
      // validate bhk value against BHKEnum
      if (!["1", "2", "3", "4", "Studio"].includes(data.bhk)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["bhk"],
          message: "bhk must be one of 1,2,3,4,Studio"
        });
      }
    }
  }

  // budgetMax >= budgetMin if both present
  if (data.budgetMin !== undefined && data.budgetMax !== undefined) {
    if (data.budgetMax < data.budgetMin) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["budgetMax"],
        message: "budgetMax must be >= budgetMin"
      });
    }
  }
});
