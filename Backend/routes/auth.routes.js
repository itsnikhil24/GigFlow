import express from "express";
import { register, login } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * Auth Routes
 */

// Register new user
// POST /api/auth/register
router.post("/register", register);

// Login user
// POST /api/auth/login
router.post("/login", login);

// Logout user
// POST /api/auth/logout
router.post("/logout", protect, (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
  });

  res.status(200).json({
    message: "Logged out successfully",
  });
});

// Get current logged-in user
// GET /api/auth/me
router.get("/me", protect, (req, res) => {
  res.status(200).json({
    user: req.user,
  });
});

export default router;
