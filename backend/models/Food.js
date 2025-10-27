import mongoose from "mongoose";

const IngredientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, default: 1 },
  unit: { type: String, default: "unit" },
});

const FoodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String }, // USDA category
  ingredients: { type: [IngredientSchema], default: [] },
}, { timestamps: true });

export default mongoose.model("Food", FoodSchema);

//placeholder file for charles' implementation