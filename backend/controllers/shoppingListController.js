import ShoppingList from "../models/ShoppingList.js";
import MealPlan from "../models/MealPlan.js";
import Food from "../models/Food.js";
import { getFoodCategoryFromUSDA } from "../utils/usdaApi.js";
import { getAccessToken, searchFoods } from "../utils/fatSecretApi.js";

// Category mapping for common ingredients
const categoryMap = {
  // Poultry
  'chicken': 'Poultry',
  'turkey': 'Poultry',
  'duck': 'Poultry',
  'chicken breast': 'Poultry',
  'chicken thigh': 'Poultry',
  
  // Meat
  'beef': 'Meat',
  'pork': 'Meat',
  'lamb': 'Meat',
  'steak': 'Meat',
  'ground beef': 'Meat',
  'bacon': 'Meat',
  'sausage': 'Meat',
  'ham': 'Meat',
  
  // Seafood
  'fish': 'Seafood',
  'salmon': 'Seafood',
  'tuna': 'Seafood',
  'shrimp': 'Seafood',
  'crab': 'Seafood',
  'lobster': 'Seafood',
  'cod': 'Seafood',
  
  // Dairy
  'milk': 'Dairy',
  'cheese': 'Dairy',
  'butter': 'Dairy',
  'yogurt': 'Dairy',
  'cream': 'Dairy',
  'sour cream': 'Dairy',
  'cottage cheese': 'Dairy',
  'mozzarella': 'Dairy',
  'cheddar': 'Dairy',
  'parmesan': 'Dairy',
  
  // Produce - Vegetables
  'tomato': 'Produce',
  'lettuce': 'Produce',
  'onion': 'Produce',
  'garlic': 'Produce',
  'carrot': 'Produce',
  'broccoli': 'Produce',
  'spinach': 'Produce',
  'pepper': 'Produce',
  'bell pepper': 'Produce',
  'potato': 'Produce',
  'cucumber': 'Produce',
  'celery': 'Produce',
  'mushroom': 'Produce',
  'zucchini': 'Produce',
  'squash': 'Produce',
  'kale': 'Produce',
  'cabbage': 'Produce',
  'cauliflower': 'Produce',
  'eggplant': 'Produce',
  
  // Produce - Fruits
  'apple': 'Produce',
  'banana': 'Produce',
  'orange': 'Produce',
  'lemon': 'Produce',
  'lime': 'Produce',
  'strawberry': 'Produce',
  'blueberry': 'Produce',
  'grape': 'Produce',
  'watermelon': 'Produce',
  'pineapple': 'Produce',
  'mango': 'Produce',
  'avocado': 'Produce',
  
  // Grains & Bakery
  'bread': 'Bakery',
  'flour': 'Baking',
  'rice': 'Grains',
  'pasta': 'Grains',
  'cereal': 'Grains',
  'oats': 'Grains',
  'quinoa': 'Grains',
  'tortilla': 'Bakery',
  
  // Condiments & Sauces
  'salt': 'Condiments',
  'pepper': 'Condiments',
  'oil': 'Condiments',
  'olive oil': 'Condiments',
  'vinegar': 'Condiments',
  'soy sauce': 'Condiments',
  'ketchup': 'Condiments',
  'mustard': 'Condiments',
  'mayonnaise': 'Condiments',
  
  // Baking
  'sugar': 'Baking',
  'baking powder': 'Baking',
  'baking soda': 'Baking',
  'vanilla': 'Baking',
  'chocolate': 'Baking',
  
  // Eggs
  'egg': 'Eggs',
  'eggs': 'Eggs',
};

/**
 * Determine category for an ingredient
 */
function getCategoryForIngredient(ingredientName) {
  const nameLower = ingredientName.toLowerCase().trim();
  
  // Check exact match first
  if (categoryMap[nameLower]) {
    return categoryMap[nameLower];
  }
  
  // Check if any key is contained in the ingredient name
  for (const [key, category] of Object.entries(categoryMap)) {
    if (nameLower.includes(key)) {
      return category;
    }
  }
  
  return 'Other';
}

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

    // Aggregate shopping items by ingredient, sum quantities for all occurrences
    const itemMap = {};
    mealPlan.days.forEach(day => {
      ["breakfast", "lunch", "dinner", "snacks"].forEach(mealType => {
        day[mealType].forEach(entry => {
          const food = foodMap[entry.foodId?.toString()];
          if (!food) return;
          const servings = entry.servings || 1;
          for (let i = 0; i < servings; i++) {
            (food.ingredients || []).forEach(ingredient => {
              const key = ingredient.name.toLowerCase();
              if (!itemMap[key]) {
                itemMap[key] = {
                  name: ingredient.name,
                  quantity: 0,
                  unit: ingredient.unit || "unit",
                  checked: false,
                  category: getCategoryForIngredient(ingredient.name)
                };
              }
              itemMap[key].quantity += ingredient.quantity || 1;
            });
          }
        });
      });
    });

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
