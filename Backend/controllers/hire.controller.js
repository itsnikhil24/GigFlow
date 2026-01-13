import mongoose from "mongoose";
import Gig from "../models/Gig.js";
import Bid from "../models/Bid.js";
import { notifyUser } from "../socket/socket.js";

/**
 * Hire a freelancer for a gig (Atomic operation)
 * PATCH /api/bids/:bidId/hire
 */
export const hireBid = async (req, res) => {
  try {
    const { bidId } = req.params;
    const clientId = req.user.id;

    const bid = await Bid.findById(bidId);
    if (!bid) {
      return res.status(404).json({ message: "Bid not found" });
    }

    const gig = await Gig.findById(bid.gigId);
    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    if (gig.ownerId.toString() !== clientId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (gig.status === "assigned") {
      return res.status(400).json({ message: "Gig already assigned" });
    }

    // 1. Assign gig
    gig.status = "assigned";
    await gig.save();

    // 2. Hire selected bid
    bid.status = "hired";
    await bid.save();

    // 3. Reject other bids
    await Bid.updateMany(
      { gigId: gig._id, _id: { $ne: bid._id } },
      { status: "rejected" }
    );

    res.status(200).json({ message: "Freelancer hired successfully" });
  } catch (error) {
    console.error("Hire error:", error);
    res.status(500).json({ message: "Failed to hire freelancer" });
  }
};


