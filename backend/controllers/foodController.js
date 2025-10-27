import Food from "../models/Food.js";
import { getFoodCategoryFromUSDA } from "../utils/usdaApi.js";

// POST /api/food
export const createFood = async (req, res) => {
  try {
    const { name, ingredients = [] } = req.body;
    // Lookup category from USDA API
    const category = await getFoodCategoryFromUSDA(name);
    const food = new Food({ name, category, ingredients });
    await food.save();
    return res.status(201).json(food);
  } catch (err) {
    console.error("Food create error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

// Optionally add GET /api/food for listing foods
export const getFoods = async (req, res) => {
  try {
    const foods = await Food.find();
    return res.status(200).json(foods);
  } catch (err) {
    console.error("Food fetch error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
