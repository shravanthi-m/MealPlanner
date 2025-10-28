import express from "express";
import { createFood, getFoods } from "../controllers/foodController.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Create a new food item (auto-fills category)
router.post("/", authMiddleware, createFood);
// List all foods
router.get("/", authMiddleware, getFoods);

export default router;
