## Prerequisites
- Node.js 18+ (includes npm)
- MongoDB Atlas account (or local MongoDB)

## Setup

### 1) Backend
```text
cd backend
cp .env.example .env  # then edit with your real values
npm install
npm run dev           # starts on http://localhost:5001
```
### 2) Frontend

In a new terminal:

``` text
cd frontend
# Ensure package.json has: "proxy": "http://localhost:5001"
npm install
npm start             # opens http://localhost:3000
```