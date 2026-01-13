import express from "express";
import {
  getGigs,
  createGig,
  getGigById,
  deleteGig,
  getMyGigs,
} from "../controllers/gig.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// 🔒 PRIVATE routes FIRST
router.get("/mygig", protect, getMyGigs);

// 🌍 PUBLIC routes
router.get("/", getGigs);
router.post("/", protect, createGig);

// 🧨 DYNAMIC routes LAST
router.get("/:id", getGigById);
router.delete("/:id", protect, deleteGig);

export default router;
