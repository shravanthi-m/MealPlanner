// CustomMealSelector.js
import React from "react";

export default function CustomMealSelector({ foods, selected, onChange }) {
  return (
    <select value={selected || ""} onChange={e => onChange(e.target.value)}>
      <option value="">Select meal...</option>
      {foods.map(food => (
        <option key={food._id} value={food._id}>
          {food.name}
        </option>
      ))}
    </select>
  );
}
