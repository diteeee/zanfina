const express = require("express");
const router = express.Router();
const { Enrollment, Kid, Class } = require("../models");
const { Sequelize } = require("sequelize");
const auth = require('../middleware/auth');
const checkRole = require('../middleware/permission');

router.get("/stats/enrollments-by-date", async (req, res) => {
  try {
    const results = await Enrollment.findAll({
      attributes: [
        [Sequelize.fn('DATE', Sequelize.col('data')), 'date'], // Extract date only (yyyy-mm-dd)
        [Sequelize.fn('COUNT', Sequelize.col('enrollmentID')), 'count']   // Count enrollments per date
      ],
      group: ['date'],
      order: [['date', 'ASC']],
      raw: true,
    });

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve enrollment stats.", error });
  }
});

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
router.post("/", auth, checkRole(["Admin"]), async (req, res) => {
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
router.put("/:enrollmentID", auth, checkRole(["Admin"]), async (req, res) => {
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
router.delete("/:enrollmentID", auth, checkRole(["Admin"]), async (req, res) => {
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