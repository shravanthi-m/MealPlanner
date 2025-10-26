import express from "express";
import Meal from "../models/meal";

const router = express.Router();

/**
 * Adds a meal with name, ingredients, and TODO: nutrition information
 * @param {Object} req
 * @param {*} res 
 */
async function addMeal(req, res) {
    try {
        // get food information
        const name = req.body.name;

        // get ingredients
        const ingredients = req.body.ingredients;

        // get nutrition information? requires knowledge of single food
        // const info = req.body.info

        // create new food
        const newFood = new Meal({
            name: name,
            ingredients: ingredients
        });

        // add food to database
        await newFood.save();
    } catch (err) {
        // log and send unexpected error back to server
        console.error("add meal error:", err);
        res.status(500).json({ message: "Server error" });
    }
}

// add new meal POST /meal/add
router.post('/meal/add', addMeal);

export default router;
