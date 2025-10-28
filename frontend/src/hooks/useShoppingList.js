// src/hooks/useShoppingList.js
import { useState, useEffect } from "react";
import { apiFetch } from "../utils/api";

export function useShoppingList(weekStart) {
  const [list, setList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    apiFetch(`/api/shopping-list?weekStart=${encodeURIComponent(weekStart)}`)
      .then(data => setList(data || null))
      .catch(setError)
      .finally(() => setLoading(false));
  }, [weekStart]);

  const checkItem = async (itemName) => {
    if (!list) return;
    const updatedItems = list.items.map(item =>
      item.name === itemName ? { ...item, checked: !item.checked } : item
    );
    setList({ ...list, items: updatedItems });
    // Optionally, update backend here
    await apiFetch("/api/shopping-list", {
      method: "POST",
      body: JSON.stringify({ weekStart, items: updatedItems })
    });
  };

  const generateList = async () => {
    setLoading(true);
    try {
      const data = await apiFetch(`/api/shopping-list/generate?weekStart=${encodeURIComponent(weekStart)}`, {
        method: "POST"
      });
      setList(data);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { list, loading, error, checkItem, generateList };
}
