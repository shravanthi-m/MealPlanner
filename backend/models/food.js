import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
//   info: { type: ?, required: true },
});


const Food = mongoose.model("Food", foodSchema);
export default Food;
