// src/hooks/useMealPlan.js
import { useState, useEffect } from "react";
import { apiFetch } from "../utils/api";

export function useMealPlan(weekStart) {
  const [mealPlan, setMealPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    apiFetch(`/api/meal-plan?weekStart=${encodeURIComponent(weekStart)}`)
      .then(data => setMealPlan(data || null))
      .catch(setError)
      .finally(() => setLoading(false));
  }, [weekStart]);

  const saveMealPlan = async (plan) => {
    setLoading(true);
    try {
      const data = await apiFetch("/api/meal-plan", {
        method: "POST",
        body: JSON.stringify({ weekStart, days: plan.days })
      });
      setMealPlan(data);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { mealPlan, setMealPlan, saveMealPlan, loading, error };
}
