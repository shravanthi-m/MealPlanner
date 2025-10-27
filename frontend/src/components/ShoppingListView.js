// ShoppingListView.js
import React from "react";

export default function ShoppingListView({ items = [], onCheck }) {
  // Group items by category
  const grouped = items.reduce((acc, item) => {
    const cat = item.category || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  return (
    <div className="shopping-list-view">
      {Object.keys(grouped).map(category => (
        <div key={category} className="shopping-category">
          <h3>{category}</h3>
          <ul>
            {grouped[category].map(item => (
              <li key={item.name}>
                <label>
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => onCheck(item.name)}
                  />
                  {item.name} ({item.quantity} {item.unit})
                </label>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
