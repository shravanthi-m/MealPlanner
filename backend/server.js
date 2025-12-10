// server.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { createApp } from "./routes/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure dotenv loads from backend folder
dotenv.config({ path: path.join(__dirname, ".env") });

dotenv.config();

const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("Missing MONGO_URI in .env");
  process.exit(1);
}

// Helpful connection logs
mongoose.connection.on("connected", () => console.log("MongoDB connected"));
mongoose.connection.on("error", (err) => console.error("MongoDB error:", err));

async function start() {
  try {
    await mongoose.connect(MONGO_URI);

    const app = createApp();

    app.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`)
    );

  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

start();
