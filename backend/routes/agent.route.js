import express from "express"
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { getUserDetails } from "../controller/agent.controller.js";
const router = express.Router();
router.get("/get-user-details",authMiddleware,getUserDetails)

export default router