import mongoose from "mongoose";

const MealEntrySchema = new mongoose.Schema({
  foodId: { type: mongoose.Schema.Types.ObjectId, ref: "Food" },
  servings: { type: Number, default: 1 },
}, { _id: false });

const DaySchema = new mongoose.Schema({
  date: { type: Date, required: true },
  breakfast: { type: [MealEntrySchema], default: [] },
  lunch: { type: [MealEntrySchema], default: [] },
  dinner: { type: [MealEntrySchema], default: [] },
  snacks: { type: [MealEntrySchema], default: [] }, // expandable later
}, { _id: false });

const MealPlanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  weekStart: { type: Date, required: true },  // normalized to Sunday/Monday start
  days: { type: [DaySchema], required: true },
}, { timestamps: true });

MealPlanSchema.index({ userId: 1, weekStart: 1 }, { unique: true });

export default mongoose.model("MealPlan", MealPlanSchema);
