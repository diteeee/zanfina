const express = require("express");
const router = express.Router();
const { Enrollment, Kid, Class } = require("../models");

// Get all enrollments
router.get("/", async (req, res) => {
    try {
        const enrollments = await Enrollment.findAll({ include: [Kid, Class] });
        res.json(enrollments);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve enrollments." });
    }
});

// Get enrollment by ID
router.get("/:enrollmentID", async (req, res) => {
    try {
        const enrollment = await Enrollment.findByPk(req.params.enrollmentID, { include: [Kid, Class] });
        if (!enrollment) {
            return res.status(404).json({ error: "Enrollment not found." });
        }
        res.json(enrollment);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve enrollment." });
    }
});

// Create new enrollment
router.post("/", async (req, res) => {
    try {
        const { data, enrollmentKidID, enrollmentClassID } = req.body;
        const kid = await Kid.findByPk(enrollmentKidID);
        const classData = await Class.findByPk(enrollmentClassID);
        if (!kid || !classData) {
            return res.status(404).json({ error: "Kid or Class not found." });
        }
        const newEnrollment = await Enrollment.create({ data, enrollmentKidID, enrollmentClassID });
        res.status(201).json(newEnrollment);
    } catch (error) {
        res.status(500).json({ error: "Failed to create enrollment." });
    }
});

// Update enrollment by ID
router.put("/:enrollmentID", async (req, res) => {
    try {
        const { data, enrollmentKidID, enrollmentClassID } = req.body;
        const enrollment = await Enrollment.findByPk(req.params.enrollmentID);
        if (!enrollment) {
            return res.status(404).json({ error: "Enrollment not found." });
        }
        await enrollment.update({ data, enrollmentKidID, enrollmentClassID });
        res.json(enrollment);
    } catch (error) {
        res.status(500).json({ error: "Failed to update enrollment." });
    }
});

// Delete enrollment by ID
router.delete("/:enrollmentID", async (req, res) => {
    try {
        const enrollment = await Enrollment.findByPk(req.params.enrollmentID);
        if (!enrollment) {
            return res.status(404).json({ error: "Enrollment not found." });
        }
        await enrollment.destroy();
        res.json({ message: "Enrollment deleted successfully." });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete enrollment." });
    }
});

module.exports = router;