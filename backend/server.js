// server.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("❌ Missing MONGO_URI in .env");
  process.exit(1);
}

// Helpful connection logs
mongoose.connection.on("connected", () => console.log("✅ MongoDB connected"));
mongoose.connection.on("error", (err) => console.error("MongoDB error:", err));

async function start() {
  try {
    await mongoose.connect(MONGO_URI);

    // Routes
    app.use("/api/auth", authRoutes);
    app.get("/", (_req, res) => res.send("API running"));

    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

start();
