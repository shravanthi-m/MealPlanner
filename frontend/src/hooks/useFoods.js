// src/hooks/useFoods.js
import { useState, useEffect } from "react";
import { apiFetch } from "../utils/api";

export function useFoods() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    apiFetch("/api/food")
      .then(data => setFoods(data || []))
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { foods, loading, error };
}
