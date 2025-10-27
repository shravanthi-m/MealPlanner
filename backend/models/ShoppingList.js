import mongoose from "mongoose";

const ShoppingItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, default: 1 },
  unit: { type: String, default: "unit" },
  checked: { type: Boolean, default: false },
  category: { type: String }, // e.g. Dairy, Produce
}, { _id: false });

const ShoppingListSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  weekStart: { type: Date, required: true },
  items: { type: [ShoppingItemSchema], default: [] }
}, { timestamps: true });

// ensure one list per user per week
ShoppingListSchema.index({ userId: 1, weekStart: 1 }, { unique: true });

export default mongoose.model("ShoppingList", ShoppingListSchema);
