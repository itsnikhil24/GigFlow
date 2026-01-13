import Gig from "../models/Gig.js";
import User from "../models/User.js";

/**
 * Fetch all open gigs (public feed)
 * GET /api/gigs?q=searchText
 */
export const getGigs = async (req, res) => {
  try {
    const { q } = req.query;

    const filter = { status: "open" };

    if (q) {
      filter.title = { $regex: q, $options: "i" }; // case-insensitive search
    }

    const gigs = await Gig.find(filter)
      .populate("ownerId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(gigs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch gigs" });
  }
};

/**
 * Create a new gig
 * POST /api/gigs
 */
export const createGig = async (req, res) => {
  try {
    const { title, description, budget } = req.body;
    const ownerId = req.user.id;

    if (!title || !description || budget == null) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const gig = await Gig.create({
      title,
      description,
      budget,
      ownerId,
    });

    res.status(201).json({ message: "Gig created successfully", gig });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create gig" });
  }
};

/**
 * Get a single gig by ID
 * GET /api/gigs/:id
 */
export const getGigById = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id)
      .populate("ownerId", "name email");

    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    res.status(200).json(gig);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch gig" });
  }
};

/**
 * Delete a gig (Owner only)
 * DELETE /api/gigs/:id
 */
export const deleteGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);

    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    // Only owner can delete
    if (gig.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await gig.deleteOne();
    res.status(200).json({ message: "Gig deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete gig" });
  }
};

/**
 * Get gigs created by the current user
 * GET /api/gigs/my
 */
export const getMyGigs = async (req, res) => {
  try {
    const gigs = await Gig.find({ ownerId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(gigs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch your gigs" });
  }
};