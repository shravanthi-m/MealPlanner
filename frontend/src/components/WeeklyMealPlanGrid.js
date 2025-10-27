// WeeklyMealPlanGrid.js
import React from "react";
import CustomMealSelector from "./CustomMealSelector";

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const mealTypes = ["breakfast", "lunch", "dinner", "snacks"];

export default function WeeklyMealPlanGrid({ weekStart, mealPlan, onChange, foods = [] }) {
  // mealPlan: { days: [{ date, breakfast: [], lunch: [], dinner: [], snacks: [] }] }
  // onChange: (updatedPlan) => void

  const handleMealChange = (dayIdx, mealType, value) => {
    const updatedDays = mealPlan.days.map((day, idx) => {
      if (idx !== dayIdx) return day;
      return {
        ...day,
        [mealType]: value,
      };
    });
    onChange({ ...mealPlan, days: updatedDays });
  };

  return (
    <table className="meal-plan-grid">
      <thead>
        <tr>
          <th>Day</th>
          {mealTypes.map(type => <th key={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</th>)}
        </tr>
      </thead>
      <tbody>
        {mealPlan.days.map((day, dayIdx) => (
          <tr key={dayIdx}>
            <td>{daysOfWeek[new Date(day.date).getDay()]}</td>
            {mealTypes.map(mealType => (
              <td key={mealType}>
                <CustomMealSelector
                  foods={foods}
                  selected={day[mealType][0]?.foodId || ""}
                  onChange={foodId => {
                    handleMealChange(dayIdx, mealType, foodId ? [{ foodId }] : []);
                  }}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
