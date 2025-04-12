const express = require("express");
const router = express.Router();
const { Kid, User } = require("../models");

// Get all kids
router.get("/", async (req, res) => {
    try {
        const kids = await Kid.findAll({ include: User });
        res.json(kids);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve kids." });
    }
});

// Get kid by ID
router.get("/:kidID", async (req, res) => {
    try {
        const kid = await Kid.findByPk(req.params.kidID, { include: User });
        if (!kid) {
            return res.status(404).json({ error: "Kid not found." });
        }
        res.json(kid);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve kid." });
    }
});

// Create new kid
router.post("/", async (req, res) => {
    try {
        const { emri, mbiemri, ditelindja, parentID } = req.body;
        const parent = await User.findByPk(parentID);
        if (!parent) {
            return res.status(404).json({ error: "Parent not found." });
        }
        const newKid = await Kid.create({ emri, mbiemri, ditelindja, parentID });
        res.status(201).json(newKid);
    } catch (error) {
        res.status(500).json({ error: "Failed to create kid." });
    }
});

// Update kid by ID
router.put("/:kidID", async (req, res) => {
    try {
        const { emri, mbiemri, ditelindja, parentID } = req.body;
        const kid = await Kid.findByPk(req.params.kidID);
        if (!kid) {
            return res.status(404).json({ error: "Kid not found." });
        }
        await kid.update({ emri, mbiemri, ditelindja, parentID });
        res.json(kid);
    } catch (error) {
        res.status(500).json({ error: "Failed to update kid." });
    }
});

// Delete kid by ID
router.delete("/:kidID", async (req, res) => {
    try {
        const kid = await Kid.findByPk(req.params.kidID);
        if (!kid) {
            return res.status(404).json({ error: "Kid not found." });
        }
        await kid.destroy();
        res.json({ message: "Kid deleted successfully." });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete kid." });
    }
});

module.exports = router;
