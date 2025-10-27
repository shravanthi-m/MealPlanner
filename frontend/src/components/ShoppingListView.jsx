// ShoppingListView.js
import React from "react";

export default function ShoppingListView({ items = [], onCheck }) {
  return (
    <div className="shopping-list-view">
      <ul>
        {items.map(item => (
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
  );
}
