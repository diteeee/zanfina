const express = require("express");
const router = express.Router();
const { HealthRecord, Kid } = require("../models");

// Get all healthRecords
router.get("/", async (req, res) => {
    try {
        const healthRecords = await HealthRecord.findAll({ include: Kid });
        res.json(healthRecords);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve healthRecords." });
    }
});

// Get healthRecord by ID
router.get("/:healthRecordID", async (req, res) => {
    try {
        const healthRecord = await HealthRecord.findByPk(req.params.healthRecordID, { include: Kid });
        if (!healthRecord) {
            return res.status(404).json({ error: "HealthRecord not found." });
        }
        res.json(healthRecord);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve healthRecord." });
    }
});

// Create new healthRecord
router.post("/", async (req, res) => {
    try {
        const { alergjite, medicalConditions, gjaku, healthRecordKidID } = req.body;
        const kid = await Kid.findByPk(healthRecordKidID);
        if (!kid) {
            return res.status(404).json({ error: "Kid not found." });
        }
        const newHealthRecord = await HealthRecord.create({ alergjite, medicalConditions, gjaku, healthRecordKidID });
        res.status(201).json(newHealthRecord);
    } catch (error) {
        res.status(500).json({ error: "Failed to create healthRecord." });
    }
});

// Update healthRecord by ID
router.put("/:healthRecordID", async (req, res) => {
    try {
        const { alergjite, medicalConditions, gjaku, healthRecordKidID } = req.body;
        const healthRecord = await HealthRecord.findByPk(req.params.healthRecordID);
        if (!healthRecord) {
            return res.status(404).json({ error: "HealthRecord not found." });
        }
        await healthRecord.update({ alergjite, medicalConditions, gjaku, healthRecordKidID });
        res.json(healthRecord);
    } catch (error) {
        res.status(500).json({ error: "Failed to update healthRecord." });
    }
});

// Delete healthRecord by ID
router.delete("/:healthRecordID", async (req, res) => {
    try {
        const healthRecord = await HealthRecord.findByPk(req.params.healthRecordID);
        if (!healthRecord) {
            return res.status(404).json({ error: "HealthRecord not found." });
        }
        await healthRecord.destroy();
        res.json({ message: "HealthRecord deleted successfully." });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete healthRecord." });
    }
});

module.exports = router;
