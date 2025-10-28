// CustomMealSelector.js
import React from "react";

export default function CustomMealSelector({ foods, selected, onChange }) {
  const value = selected || "";
  return (
    <select
      className={`custom-select ${value ? 'has-value' : ''}`}
      value={value}
      onChange={e => onChange(e.target.value)}
      aria-label="Select meal"
    >
      <option value="">Select meal...</option>
      {foods.map(food => (
        <option key={food._id} value={food._id}>
          {food.name}
        </option>
      ))}
    </select>
  );
}
