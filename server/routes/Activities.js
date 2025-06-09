const express = require("express");
const router = express.Router();
const { Activity, Teacher } = require("../models");
const auth = require('../middleware/auth');
const checkRole = require('../middleware/permission');

// Get all activitys
router.get("/", async (req, res) => {
    try {
        const activitys = await Activity.findAll({ include: Teacher });
        res.json(activitys);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve activitys." });
    }
});

// Get activity by ID
router.get("/:activityID", async (req, res) => {
    try {
        const activity = await Activity.findByPk(req.params.activityID, { include: Teacher });
        if (!activity) {
            return res.status(404).json({ error: "Activity not found." });
        }
        res.json(activity);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve activity." });
    }
});

// Create new activity
router.post("/", auth, checkRole(["Admin"]), async (req, res) => {
    try {
        const { emri, pershkrimi, data, activityTeacherID } = req.body;
        const teacher = await Teacher.findByPk(activityTeacherID);
        if (!teacher) {
            return res.status(404).json({ error: "Teacher not found." });
        }
        const newActivity = await Activity.create({ emri, pershkrimi, data, activityTeacherID });
        res.status(201).json(newActivity);
    } catch (error) {
        res.status(500).json({ error: "Failed to create activity." });
    }
});

// Update activity by ID
router.put("/:activityID", auth, checkRole(["Admin"]), async (req, res) => {
    try {
        const { emri, pershkrimi, data, activityTeacherID } = req.body;
        const activity = await Activity.findByPk(req.params.activityID);
        if (!activity) {
            return res.status(404).json({ error: "Activity not found." });
        }
        await activity.update({ emri, pershkrimi, data, activityTeacherID });
        res.json(activity);
    } catch (error) {
        res.status(500).json({ error: "Failed to update activity." });
    }
});

// Delete activity by ID
router.delete("/:activityID", auth, checkRole(["Admin"]), async (req, res) => {
    try {
        const activity = await Activity.findByPk(req.params.activityID);
        if (!activity) {
            return res.status(404).json({ error: "Activity not found." });
        }
        await activity.destroy();
        res.json({ message: "Activity deleted successfully." });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete activity." });
    }
});

module.exports = router;
