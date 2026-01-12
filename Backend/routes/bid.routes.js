import express from "express";
import {
  placeBid,
  getBidsByGig,
} from "../controllers/bid.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { hireBid } from "../controllers/hire.controller.js";

const router = express.Router();

/**
 * Bid Routes
 */

// Submit a bid on a gig
// POST /api/bids
router.post("/", protect, placeBid);

// Get all bids for a specific gig (Owner only)
// GET /api/bids/:gigId
router.get("/:gigId", protect, getBidsByGig);

// Hire a freelancer (Atomic operation)
// PATCH /api/bids/:bidId/hire
router.patch("/:bidId/hire", protect, hireBid);

export default router;
