import Bid from "../models/Bid.js";
import Gig from "../models/Gig.js";

/**
 * Submit a bid for a gig
 * POST /api/bids
 */
export const placeBid = async (req, res) => {
  try {
    const { gigId, message, price } = req.body;
    const freelancerId = req.user.id;

    // Basic validation
    if (!gigId || !price) {
      return res.status(400).json({
        message: "Gig ID and price are required",
      });
    }

    // Check if gig exists and is open
    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    if (gig.status !== "open") {
      return res.status(400).json({
        message: "Bidding is closed for this gig",
      });
    }

    // Prevent owner from bidding on own gig
    if (gig.ownerId.toString() === freelancerId) {
      return res.status(403).json({
        message: "You cannot bid on your own gig",
      });
    }

    // Create bid
    const bid = await Bid.create({
      gigId,
      freelancerId,
      message,
      price,
    });

    res.status(201).json({
      message: "Bid placed successfully",
      bid,
    });
  } catch (error) {
    // Handle duplicate bid error (unique index)
    if (error.code === 11000) {
      return res.status(409).json({
        message: "You have already placed a bid on this gig",
      });
    }

    res.status(500).json({
      message: "Failed to place bid",
    });
  }
};

/**
 * Get all bids for a specific gig (Owner only)
 * GET /api/bids/:gigId
 */
export const getBidsByGig = async (req, res) => {
  try {
    const { gigId } = req.params;
    const userId = req.user.id;

    // Check if gig exists
    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    // Only gig owner can see bids
    if (gig.ownerId.toString() !== userId) {
      return res.status(403).json({
        message: "You are not allowed to view these bids",
      });
    }

    const bids = await Bid.find({ gigId })
      .populate("freelancerId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(bids);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch bids",
    });
  }
};
