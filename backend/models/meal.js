import mongoose, { Schema } from "mongoose";
import Food from "./food";

const mealScehma = new mongoose.Schema({
  name: { type: String, required: true },
  ingredients: [{ type: Schema.Types.ObjectId, ref: 'Food', required: false}],
//   info: { type: ?, required: true}
});

const Meal = mongoose.model("Meal", mealScehma);
export default Meal;