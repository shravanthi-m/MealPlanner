# Meal Planner App

A full-stack web application for planning weekly meals, managing shopping lists, and tracking nutritional information. Built with React, Node.js, Express, and MongoDB.

## Tech Stack

- **Frontend**: React 18 + Vite
- **Backend**: Node.js + Express
- **Database**: MongoDB Atlas
- **APIs**: Spoonacular (primary), FatSecret, USDA (optional)

## Prerequisites

- Node.js (v14 or higher)
- npm
- MongoDB Atlas account
- Spoonacular API key
- FatSecret API key

## Installation

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd frontend
npm install
```

## Configuration

### Backend Environment Variables

Create `backend/.env`:

```env
MONGODB_URI=mongodb+srv://your-connection-string
JWT_SECRET=your-secure-random-string
SPOONACULAR_API_KEY=your-spoonacular-api-key
FATSECRET_API_KEY=your-fatsecret-key
```

### Frontend Environment Variables

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5001
```

### Required API Keys

1. **MongoDB Atlas**: Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. **Spoonacular**: Get API key at [spoonacular.com/food-api](https://spoonacular.com/food-api)
3. **FatSecret**: Get API key at [platform.fatsecret.com/api](https://platform.fatsecret.com/api)

## Running the Application

```bash
# Start backend (from backend directory)
npm start

# Start frontend (from frontend directory)
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5001

## Features

- User authentication (JWT)
- Food search with nutrition data
- Weekly meal planning
- Automatic shopping list generation
- PDF export for shopping lists
- API performance metrics


