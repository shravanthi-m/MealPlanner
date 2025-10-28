import express from "express";
import { createOrUpdateMealPlan, getMealPlan } from "../controllers/mealPlanController.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.post("/", authMiddleware, createOrUpdateMealPlan);
router.get("/", authMiddleware, getMealPlan);

export default router;
