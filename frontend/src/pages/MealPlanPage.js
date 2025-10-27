// Weekly Meal Plan Page
import React from "react";
import WeeklyMealPlanGrid from "../components/WeeklyMealPlanGrid";
import { useFoods } from "../hooks/useFoods";
import { useMealPlan } from "../hooks/useMealPlan";
import { useNavigate } from "react-router-dom";

const getWeekStartISO = () => {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day;
  const weekStart = new Date(now.setDate(diff));
  return weekStart.toISOString().slice(0, 10); // YYYY-MM-DD
};

const MealPlanPage = () => {
  const navigate = useNavigate();
  const weekStart = getWeekStartISO();
  const { mealPlan, setMealPlan, saveMealPlan, loading, error } = useMealPlan(weekStart);
  const { foods, loading: foodsLoading, error: foodsError } = useFoods();

  if (loading || foodsLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message || error.toString()}</div>;
  if (foodsError) return <div>Error: {foodsError.message || foodsError.toString()}</div>;

  // Default meal plan if none exists
  const defaultPlan = {
    days: Array.from({ length: 7 }, (_, i) => {
      const date = new Date(weekStart);
      date.setDate(date.getDate() + i);
      return {
        date: date.toISOString(),
        breakfast: [],
        lunch: [],
        dinner: [],
        snacks: [],
      };
    })
  };

  return (
    <div>
      <h1>Weekly Meal Plan</h1>
      <WeeklyMealPlanGrid
        weekStart={weekStart}
        mealPlan={mealPlan || defaultPlan}
        onChange={setMealPlan}
        foods={foods}
      />
      <button
        onClick={() => saveMealPlan(mealPlan || defaultPlan)}
        style={{ marginTop: "1rem" }}
      >
        Save Meal Plan
      </button>
      <button
        onClick={() => navigate("/shopping-list")}
        style={{ marginTop: "1rem", marginLeft: "1rem" }}
      >
        Go to Shopping List
      </button>
      {error && <div style={{ color: "red" }}>{error.message || error.toString()}</div>}
    </div>
  );
};

export default MealPlanPage;
