import React from 'react';

const HomePage = () => {
  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-bold mb-4">Welcome to the Meal Planner!</h1>
      <p className="text-gray-600">This is your main dashboard. You are successfully logged in (assuming authentication worked).</p>
      <p className="text-gray-600 mt-2">Go to "Plan" in the navigation to create your weekly meals.</p>
    </div>
  );
};

export default HomePage;
