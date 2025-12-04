import express from "express";
import { createFood, getFoods, searchFood, saveFoodToDatabase } from "../controllers/foodController.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Search foods (database + FatSecret API)
router.get("/search", authMiddleware, searchFood);
// Create a new food item (auto-fills category)
router.post("/", authMiddleware, createFood);
// Save a food from API to database
router.post("/save", authMiddleware, saveFoodToDatabase);
// List all foods
router.get("/", authMiddleware, getFoods);

export default router;
