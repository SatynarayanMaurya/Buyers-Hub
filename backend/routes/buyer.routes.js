import express from "express"
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { createBuyer, getBuyerHistory, getBuyers, updateBuyer } from "../controller/buyer.controller.js";
import { exportBuyers } from "../controller/export.controller.js";
import { importBuyers } from "../controller/import.controller.js";
import multer from "multer";
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/get-all-buyers",authMiddleware,getBuyers)
router.post("/create-buyer",authMiddleware,createBuyer)
router.put("/update-buyer/:id",authMiddleware,updateBuyer)
router.get("/get-buyer-history/:id",authMiddleware,getBuyerHistory)

router.get("/export-buyers", authMiddleware, exportBuyers);
router.post("/import-buyers", authMiddleware, upload.single("file"), importBuyers);
export default router