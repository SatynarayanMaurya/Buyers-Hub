import express from "express"
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { createBuyer, getBuyers } from "../controller/buyer.controller.js";

const router = express.Router();


router.get("/get-all-buyers",authMiddleware,getBuyers)
router.post("/create-buyer",authMiddleware,createBuyer)
export default router