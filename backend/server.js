// server.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import mealPlanRoutes from "./routes/mealPlan.js";
import shoppingListRoutes from "./routes/shoppingList.js";
import foodRoutes from "./routes/food.js";
import pdfRoutes from "./routes/pdf.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure dotenv loads from backend folder
dotenv.config({ path: path.join(__dirname, ".env") });


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("Missing MONGO_URI in .env");
  process.exit(1);
}

// Helpful connection logs
mongoose.connection.on("connected", () => console.log("MongoDB connected"));
mongoose.connection.on("error", (err) => console.error("MongoDB error:", err));

export async function start() {
  try {
    await mongoose.connect(MONGO_URI);

    // Mount all routes AFTER MongoDB is connected
    app.use("/api/auth", authRoutes);
    app.use("/api/meal-plan", mealPlanRoutes);
    app.use("/api/shopping-list", shoppingListRoutes);
    app.use("/api/food", foodRoutes);
    app.use("/api", pdfRoutes);
    app.get("/", (_req, res) => res.send("API running"));

    app.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`)
    );

    return app;
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

start();
