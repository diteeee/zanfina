const express = require("express");
const router = express.Router();
const { Feedback, User } = require("../models");

// Get all feedbacks
router.get("/", async (req, res) => {
    try {
        const feedbacks = await Feedback.findAll({ include: User });
        res.json(feedbacks);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve feedbacks." });
    }
});

// Get feedback by ID
router.get("/:feedbackID", async (req, res) => {
    try {
        const feedback = await Feedback.findByPk(req.params.feedbackID, { include: User });
        if (!feedback) {
            return res.status(404).json({ error: "Feedback not found." });
        }
        res.json(feedback);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve feedback." });
    }
});

// Create new feedback
router.post("/", async (req, res) => {
    try {
        const { teksti, rating, parentID } = req.body;
        const parent = await User.findByPk(parentID);
        if (!parent) {
            return res.status(404).json({ error: "Parent not found." });
        }
        const newFeedback = await Feedback.create({ teksti, rating, parentID });
        res.status(201).json(newFeedback);
    } catch (error) {
        res.status(500).json({ error: "Failed to create feedback." });
    }
});

// Update feedback by ID
router.put("/:feedbackID", async (req, res) => {
    try {
        const { teksti, rating, parentID } = req.body;
        const feedback = await Feedback.findByPk(req.params.feedbackID);
        if (!feedback) {
            return res.status(404).json({ error: "Feedback not found." });
        }
        await feedback.update({ teksti, rating, parentID });
        res.json(feedback);
    } catch (error) {
        res.status(500).json({ error: "Failed to update feedback." });
    }
});

// Delete feedback by ID
router.delete("/:feedbackID", async (req, res) => {
    try {
        const feedback = await Feedback.findByPk(req.params.feedbackID);
        if (!feedback) {
            return res.status(404).json({ error: "Feedback not found." });
        }
        await feedback.destroy();
        res.json({ message: "Feedback deleted successfully." });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete feedback." });
    }
});

module.exports = router;
