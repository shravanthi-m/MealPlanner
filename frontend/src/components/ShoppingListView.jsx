// ShoppingListView.js
import React from "react";

export default function ShoppingListView({ items = [], onCheck }) {
  if (!items || items.length === 0) return <div className="empty">No items in the shopping list.</div>;

  return (
    <div className="shopping-list-view">
      <ul>
        {items.map((item) => (
          <li key={item.name} className="shopping-item">
            <label>
              <input
                type="checkbox"
                checked={!!item.checked}
                onChange={() => onCheck(item.name)}
              />
              <span>{item.name}</span>
            </label>
            <div className="meta">{item.quantity} {item.unit}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
