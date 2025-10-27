import MealPlan from "../models/MealPlan.js";

//temp
export const createOrUpdateMealPlan = async (req, res) => {
  try {
    const { weekStart, days } = req.body;
    const userId = req.user._id;

    const mealPlan = await MealPlan.findOneAndUpdate(
      { userId, weekStart },
      { userId, weekStart, days },
      { new: true, upsert: true }
    );

    return res.status(200).json(mealPlan);
  } catch (err) {
    console.error("Meal plan error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const getMealPlan = async (req, res) => {
  try {
    const { weekStart } = req.query;
    const userId = req.user._id;

    const mealPlan = await MealPlan.findOne({ userId, weekStart });
    return res.status(200).json(mealPlan);
  } catch (err) {
    console.error("Meal plan fetch error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
