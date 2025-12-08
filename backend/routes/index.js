import express from "express";
import cors from "cors";
import authRoutes from "./auth.js";
import mealPlanRoutes from "./mealPlan.js";
import shoppingListRoutes from "./shoppingList.js";
import foodRoutes from "./food.js";
import pdfRoutes from "./pdf.js";

/**
 * Creates express app with all routes mounted
 * @returns 
 */
export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());
  // Mount all routes AFTER MongoDB is connected
  app.use("/api/auth", authRoutes);
  app.use("/api/meal-plan", mealPlanRoutes);
  app.use("/api/shopping-list", shoppingListRoutes);
  app.use("/api/food", foodRoutes);
  app.use("/api", pdfRoutes);
  app.get("/", (_req, res) => res.send("API running"));
  return app;
}