import express from "express";
import { getShoppingList, createShoppingList, generateShoppingList } from "../controllers/shoppingListController.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();


// Generate categorized shopping list from meal plan
router.post("/generate", authMiddleware, generateShoppingList);

router.get("/", authMiddleware, getShoppingList);
router.post("/", authMiddleware, createShoppingList);

export default router;
