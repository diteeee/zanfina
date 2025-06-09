const express = require("express");
const router = express.Router();
const { Meal } = require("../models");
const auth = require('../middleware/auth');
const checkRole = require('../middleware/permission');

// Get all meals
router.get("/", async (req, res) => {
    try {
        const meals = await Meal.findAll();
        res.json(meals);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve meals." });
    }
});

// Get meal by ID
router.get("/:mealID", async (req, res) => {
    try {
        const meal = await Meal.findByPk(req.params.mealID);
        if (!meal) {
            return res.status(404).json({ error: "Meal not found." });
        }
        res.json(meal);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve meal." });
    }
});

// Create new meal
router.post("/", auth, checkRole(["Admin"]), async (req, res) => {
    try {
        const { emri, pershkrimi, orari } = req.body;
        const newMeal = await Meal.create({ emri, pershkrimi, orari });
        res.status(201).json(newMeal);
    } catch (error) {
        res.status(500).json({ error: "Failed to create meal." });
    }
});

// Update meal by ID
router.put("/:mealID", auth, checkRole(["Admin"]), async (req, res) => {
    try {
        const { emri, pershkrimi, orari } = req.body;
        const meal = await Meal.findByPk(req.params.mealID);
        if (!meal) {
            return res.status(404).json({ error: "Meal not found." });
        }
        await meal.update({ emri, pershkrimi, orari });
        res.json(meal);
    } catch (error) {
        res.status(500).json({ error: "Failed to update meal." });
    }
});

// Delete meal by ID
router.delete("/:mealID", auth, checkRole(["Admin"]), async (req, res) => {
    try {
        const meal = await Meal.findByPk(req.params.mealID);
        if (!meal) {
            return res.status(404).json({ error: "Meal not found." });
        }
        await meal.destroy();
        res.json({ message: "Meal deleted successfully." });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete meal." });
    }
});

module.exports = router;