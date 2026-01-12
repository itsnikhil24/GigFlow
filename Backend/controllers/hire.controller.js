import mongoose from "mongoose";
import Gig from "../models/Gig.js";
import Bid from "../models/Bid.js";
import { notifyUser } from "../socket/socket.js";

/**
 * Hire a freelancer for a gig (Atomic operation)
 * PATCH /api/bids/:bidId/hire
 */
export const hireBid = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { bidId } = req.params;
    const clientId = req.user.id;

    // Fetch bid
    const bid = await Bid.findById(bidId).session(session);
    if (!bid) {
      return res.status(404).json({ message: "Bid not found" });
    }

    // Fetch gig
    const gig = await Gig.findById(bid.gigId).session(session);
    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    // Authorization: only gig owner can hire
    if (gig.ownerId.toString() !== clientId) {
      return res.status(403).json({
        message: "You are not authorized to hire for this gig",
      });
    }

    // Prevent double hiring (race condition protection)
    if (gig.status === "assigned") {
      return res.status(400).json({
        message: "This gig has already been assigned",
      });
    }

    // Update gig status
    gig.status = "assigned";
    await gig.save({ session });

    // Reject all bids for this gig
    await Bid.updateMany(
      { gigId: gig._id },
      { status: "rejected" },
      { session }
    );

    // Mark selected bid as hired
    bid.status = "hired";
    await bid.save({ session });

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    // 🔔 Real-time notification (Bonus)
    notifyUser(
      bid.freelancerId.toString(),
      `You have been hired for "${gig.title}"`
    );

    res.status(200).json({
      message: "Freelancer hired successfully",
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    res.status(500).json({
      message: "Failed to hire freelancer",
    });
  }
};
