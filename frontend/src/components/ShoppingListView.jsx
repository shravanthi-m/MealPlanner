// ShoppingListView.js
import React from "react";

export default function ShoppingListView({ items = [], onCheck }) {
  if (!items || items.length === 0) return <div className="empty">No items in the shopping list.</div>;

  // Group items by category
  const groupedItems = items.reduce((acc, item) => {
    const category = item.category || "Other";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});

  // Define category order for grocery shopping flow
  const categoryOrder = [
    'Produce',
    'Meat',
    'Poultry', 
    'Seafood',
    'Dairy',
    'Eggs',
    'Bakery',
    'Grains',
    'Condiments',
    'Baking',
    'Other'
  ];

  // Sort categories based on the defined order
  const sortedCategories = Object.keys(groupedItems).sort((a, b) => {
    const indexA = categoryOrder.indexOf(a);
    const indexB = categoryOrder.indexOf(b);
    const orderA = indexA === -1 ? categoryOrder.length : indexA;
    const orderB = indexB === -1 ? categoryOrder.length : indexB;
    return orderA - orderB;
  });

  return (
    <div className="shopping-list-view">
      {sortedCategories.map((category) => (
        <div key={category} className="category-section">
          <h3 className="category-title">{category}</h3>
          <ul>
            {groupedItems[category].map((item) => (
              <li key={item.name} className="shopping-item">
                <label>
                  <input
                    type="checkbox"
                    checked={!!item.checked}
                    onChange={() => onCheck(item.name)}
                  />
                  <span className={item.checked ? "checked-item" : ""}>{item.name}</span>
                </label>
                <div className="meta">{item.quantity} {item.unit}</div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
