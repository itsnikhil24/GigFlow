import express from "express";
import {
  getGigs,
  createGig,
  getGigById,
  deleteGig,
} from "../controllers/gig.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * Gig Routes
 */

// Fetch all open gigs (public, with search)
// GET /api/gigs?q=keyword
router.get("/", getGigs);

// Create a new gig (authenticated)
// POST /api/gigs
router.post("/", protect, createGig);

// Get single gig by ID
// GET /api/gigs/:id
router.get("/:id", getGigById);

// Delete gig (Owner only)
// DELETE /api/gigs/:id
router.delete("/:id", protect, deleteGig);

export default router;
