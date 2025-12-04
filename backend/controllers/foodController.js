import Food from "../models/Food.js";
import { getFoodCategoryFromUSDA } from "../utils/usdaApi.js";
import { searchRecipes } from "../utils/spoonacularApi.js";

// POST /api/food
export const createFood = async (req, res) => {
  try {
    const { name, category, ingredients = [] } = req.body;
    const food = new Food({ name, category, ingredients });
    await food.save();
    return res.status(201).json(food);
  } catch (err) {
    console.error("Food create error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

// Optionally add GET /api/food/ for listing foods

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

// GET /api/food/search?query=chicken
export const searchFood = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: "Query parameter is required" });
    }

    // Search in database first (case-insensitive)
    const dbFoods = await Food.find({ 
      name: { $regex: query, $options: 'i' } 
    }).limit(10);

    // Get database food names for filtering
    const dbFoodNames = new Set(dbFoods.map(f => f.name.toLowerCase()));

    // Search Spoonacular API for recipes with ingredients
    let apiFoods = [];
    try {
      const allApiFoods = await searchRecipes(query, 10);
      
      // Filter out foods that are already in database
      apiFoods = allApiFoods.filter(food => 
        !dbFoodNames.has(food.name.toLowerCase())
      );
    } catch (apiErr) {
      console.error("Spoonacular API error:", apiErr);
    }

    // Only return API results (foods not in database)
    const apiResults = apiFoods.map(food => ({
      name: food.name,
      category: food.category,
      spoonacular_id: food.spoonacular_id,
      image: food.image,
      servings: food.servings,
      readyInMinutes: food.readyInMinutes,
      ingredients: food.ingredients || [],
      source: 'spoonacular',
      inDatabase: false
    }));

    return res.status(200).json({
      api: apiResults
    });
  } catch (err) {
    console.error("Food search error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

// POST /api/food/save - Save a food from API to database
export const saveFoodToDatabase = async (req, res) => {
  try {
    const { name, category, ingredients = [] } = req.body;

    // Check if food already exists
    const existingFood = await Food.findOne({ name: { $regex: `^${name}$`, $options: 'i' } });
    if (existingFood) {
      return res.status(200).json({ message: "Food already exists", food: existingFood });
    }

    // Create and save new food
    const food = new Food({ name, category, ingredients });
    await food.save();
    
    return res.status(201).json({ message: "Food saved successfully", food });
  } catch (err) {
    console.error("Food save error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};