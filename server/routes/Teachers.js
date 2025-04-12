const express = require("express");
const router = express.Router();
const { Teacher } = require("../models");

// Get all teachers
router.get("/", async (req, res) => {
    try {
        const teachers = await Teacher.findAll();
        res.json(teachers);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve teachers." });
    }
});

// Get teacher by ID
router.get("/:teacherID", async (req, res) => {
    try {
        const teacher = await Teacher.findByPk(req.params.teacherID);
        if (!teacher) {
            return res.status(404).json({ error: "Teacher not found." });
        }
        res.json(teacher);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve teacher." });
    }
});

// Create new teacher
router.post("/", async (req, res) => {
    try {
        const { emri, mbiemri, nrTel, specializimi } = req.body;
        const newTeacher = await Teacher.create({ emri, mbiemri, nrTel, specializimi });
        res.status(201).json(newTeacher);
    } catch (error) {
        res.status(500).json({ error: "Failed to create teacher." });
    }
});

// Update teacher by ID
router.put("/:teacherID", async (req, res) => {
    try {
        const { emri, mbiemri, nrTel, specializimi } = req.body;
        const teacher = await Teacher.findByPk(req.params.teacherID);
        if (!teacher) {
            return res.status(404).json({ error: "Teacher not found." });
        }
        await teacher.update({ emri, mbiemri, nrTel, specializimi });
        res.json(teacher);
    } catch (error) {
        res.status(500).json({ error: "Failed to update teacher." });
    }
});

// Delete teacher by ID
router.delete("/:teacherID", async (req, res) => {
    try {
        const teacher = await Teacher.findByPk(req.params.teacherID);
        if (!teacher) {
            return res.status(404).json({ error: "Teacher not found." });
        }
        await teacher.destroy();
        res.json({ message: "Teacher deleted successfully." });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete teacher." });
    }
});

module.exports = router;
