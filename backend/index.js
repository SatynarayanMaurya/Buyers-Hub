import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import buyerRoutes from "./routes/buyer.routes.js";

dotenv.config();

const app = express();
app.use(cors({
    origin:"*"
}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/buyers", buyerRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
