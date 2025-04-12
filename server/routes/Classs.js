const express = require("express");
const router = express.Router();
const { Class, Teacher } = require("../models");

// Get all classes
router.get("/", async (req, res) => {
    try {
        const classes = await Class.findAll({ include: Teacher });
        res.json(classes);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve classes." });
    }
});

// Get class by ID
router.get("/:classID", async (req, res) => {
    try {
        const classData = await Class.findByPk(req.params.classID, { include: Teacher });
        if (!classData) {
            return res.status(404).json({ error: "Class not found." });
        }
        res.json(classData);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve class." });
    }
});

// Create new class
router.post("/", async (req, res) => {
    try {
        const { emri, orari, classTeacherID } = req.body;
        const teacher = await Teacher.findByPk(classTeacherID);
        if (!teacher) {
            return res.status(404).json({ error: "Teacher not found." });
        }
        const newClass = await Class.create({ emri, orari, classTeacherID });
        res.status(201).json(newClass);
    } catch (error) {
        res.status(500).json({ error: "Failed to create class." });
    }
});

// Update class by ID
router.put("/:classID", async (req, res) => {
    try {
        const { emri, orari, classTeacherID } = req.body;
        const classData = await Class.findByPk(req.params.classID);
        if (!classData) {
            return res.status(404).json({ error: "Class not found." });
        }
        await classData.update({ emri, orari, classTeacherID });
        res.json(classData);
    } catch (error) {
        res.status(500).json({ error: "Failed to update class." });
    }
});

// Delete class by ID
router.delete("/:classID", async (req, res) => {
    try {
        const classData = await Class.findByPk(req.params.classID);
        if (!classData) {
            return res.status(404).json({ error: "Class not found." });
        }
        await classData.destroy();
        res.json({ message: "Class deleted successfully." });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete class." });
    }
});

module.exports = router;
