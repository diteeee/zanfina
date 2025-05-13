const express = require("express");
const router = express.Router();
const { Supply, Class } = require("../models");

// Get all supplys
router.get("/", async (req, res) => {
    try {
        const supplys = await Supply.findAll({ include: Class });
        res.json(supplys);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve supplys." });
    }
});

// Get supply by ID
router.get("/:supplyID", async (req, res) => {
    try {
        const supply = await Supply.findByPk(req.params.supplyID, { include: Class });
        if (!supply) {
            return res.status(404).json({ error: "Supply not found." });
        }
        res.json(supply);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve supply." });
    }
});

// Create new supply
router.post("/", async (req, res) => {
    try {
        const { emri, sasia, supplyClassID } = req.body;
        const classInstance = await Class.findByPk(supplyClassID);
        if (!classInstance) {
            return res.status(404).json({ error: "Class not found." });
        }
        const newSupply = await Supply.create({ emri, sasia, supplyClassID });
        res.status(201).json(newSupply);
    } catch (error) {
        res.status(500).json({ error: "Failed to create supply." });
    }
});

// Update supply by ID
router.put("/:supplyID", async (req, res) => {
    try {
        const { emri, sasia, supplyClassID } = req.body;
        const supply = await Supply.findByPk(req.params.supplyID);
        if (!supply) {
            return res.status(404).json({ error: "Supply not found." });
        }
        await supply.update({ emri, sasia, supplyClassID });
        res.json(supply);
    } catch (error) {
        res.status(500).json({ error: "Failed to update supply." });
    }
});

// Delete supply by ID
router.delete("/:supplyID", async (req, res) => {
    try {
        const supply = await Supply.findByPk(req.params.supplyID);
        if (!supply) {
            return res.status(404).json({ error: "Supply not found." });
        }
        await supply.destroy();
        res.json({ message: "Supply deleted successfully." });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete supply." });
    }
});

module.exports = router;
