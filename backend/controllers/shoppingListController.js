import ShoppingList from "../models/ShoppingList.js";
import MealPlan from "../models/MealPlan.js";
import Food from "../models/Food.js";
import { getFoodCategoryFromUSDA } from "../utils/usdaApi.js";
// POST /api/shopping-list/generate?weekStart=...
export const generateShoppingList = async (req, res) => {
  try {
    const { weekStart } = req.query;
    const userId = req.user._id;

    // Get meal plan for the week
    const mealPlan = await MealPlan.findOne({ userId, weekStart });
    if (!mealPlan) return res.status(404).json({ error: "Meal plan not found" });

    // Collect all foodIds from all days/meals
    const foodIdSet = new Set();
    mealPlan.days.forEach(day => {
      ["breakfast", "lunch", "dinner", "snacks"].forEach(mealType => {
        day[mealType].forEach(entry => {
          if (entry.foodId) foodIdSet.add(entry.foodId.toString());
        });
      });
    });

    // Fetch all foods
    const foods = await Food.find({ _id: { $in: Array.from(foodIdSet) } });
    const foodMap = {};
    for (const food of foods) {
      foodMap[food._id.toString()] = food;
    }

    // Aggregate shopping items by ingredient, sum quantities, and categorize
    const itemMap = {};
    mealPlan.days.forEach(day => {
      ["breakfast", "lunch", "dinner", "snacks"].forEach(mealType => {
        day[mealType].forEach(entry => {
          const food = foodMap[entry.foodId?.toString()];
          if (!food) return;
          // For each ingredient in the food
          (food.ingredients || []).forEach(ingredient => {
            const key = ingredient.name.toLowerCase();
            if (!itemMap[key]) {
              itemMap[key] = {
                name: ingredient.name,
                quantity: 0,
                unit: ingredient.unit || "unit",
                checked: false,
                category: null
              };
            }
            // Multiply by servings if present
            const servings = entry.servings || 1;
            itemMap[key].quantity += (ingredient.quantity || 1) * servings;
          });
        });
      });
    });

    // Fill missing categories using USDA API
    for (const key in itemMap) {
      if (!itemMap[key].category) {
        itemMap[key].category = await getFoodCategoryFromUSDA(itemMap[key].name);
      }
    }

    // Save shopping list
    const items = Object.values(itemMap);
    const list = await ShoppingList.findOneAndUpdate(
      { userId, weekStart },
      { userId, weekStart, items },
      { new: true, upsert: true }
    );
    return res.status(200).json(list);
  } catch (err) {
    console.error("Shopping list generation error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

// GET /api/shopping-list?weekStart=...
export const getShoppingList = async (req, res) => {
  try {
    const { weekStart } = req.query;
    const userId = req.user._id;

    const list = await ShoppingList.findOne({ userId, weekStart });
    return res.status(200).json(list);
  } catch (err) {
    console.error("Shopping list fetch error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

// POST /api/shopping-list (manual create for now)
export const createShoppingList = async (req, res) => {
  try {
    const { weekStart, items } = req.body;
    const userId = req.user._id;

    const list = await ShoppingList.findOneAndUpdate(
      { userId, weekStart },
      { userId, weekStart, items },
      { new: true, upsert: true }
    );

    return res.status(200).json(list);
  } catch (err) {
    console.error("Shopping list create error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
