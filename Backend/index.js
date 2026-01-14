import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";

// Routes
import authRoutes from "./routes/auth.routes.js";
import gigRoutes from "./routes/gig.routes.js";
import bidRoutes from "./routes/bid.routes.js";

// Load env variables
dotenv.config();

// Initialize Express app
const app = express();

/* -------------------- DATABASE -------------------- */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      autoIndex: false,
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

connectDB();

/* -------------------- CORS (PRODUCTION SAFE) -------------------- */
/**
 * CLIENT_URL examples:
 * - http://localhost:5173
 * - https://gigflow-frontend.vercel.app
 */
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true, // REQUIRED for cookies
  })
);

/* -------------------- MIDDLEWARE -------------------- */
app.use(express.json());
app.use(cookieParser());

/* -------------------- ROUTES -------------------- */
app.use("/api/auth", authRoutes);
app.use("/api/gigs", gigRoutes);
app.use("/api/bids", bidRoutes);

/* -------------------- HEALTH CHECK -------------------- */
app.get("/", (req, res) => {
  res.send("GigFlow Backend is running 🚀");
});

/* -------------------- SERVER -------------------- */
const PORT = process.env.PORT || 10000; // Render uses dynamic ports
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
