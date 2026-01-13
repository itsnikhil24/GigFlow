import express from "express";
import {
  placeBid,
  getBidsByGig,
  getMyBids,
} from "../controllers/bid.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { hireBid } from "../controllers/hire.controller.js";

const router = express.Router();

// 🔒 USER routes
router.get("/mybid", protect, getMyBids);

// ACTION routes
router.post("/", protect, placeBid);
router.patch("/:bidId/hire", protect, hireBid);

// 🧨 DYNAMIC LAST
router.get("/:gigId", protect, getBidsByGig);

export default router;
