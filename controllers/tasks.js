const express = require("express");
const router = express.Router();
const Task = require("../models/task");
const User = require("../models/user");

// CREATE NEW TASK
router.post("/add", async (req, res) => {
    try {
        const newTask = new Task({
            user: req.session.user._id,
            description: req.body.description,
            category: "Self-added",
            mood: "None", // Default for manually added tasks
            completed: false,
            xpReward: 10,
        });

        await newTask.save();
        res.redirect("/account/dashboard");
    } catch (error) {
        console.error("Error adding task:", error);
        res.status(500).send("Failed to add task");
    }
});

// GET ALL TASK FOR USER
router.get("/", async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.session.user._id });
        res.json(tasks);
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).send("Failed to fetch tasks");
    }
});

// UPDATE TASK DESCRIPTION
router.post("/edit/:id", async (req, res) => {
    try {
        await Task.findByIdAndUpdate(req.params.id, { description: req.body.description });
        res.redirect("/account/dashboard");
    } catch (error) {
        console.error("Error updating task:", error);
        res.status(500).send("Failed to update task");
    }
});

// MARK TASK COMPLETE
router.post("/toggle-complete/:id", async (req, res) => {
    try {
        // Ensure user is logged in
        if (!req.session.user) {
            return res.status(401).send("Unauthorized: No user in session");
        }
        
        const task = await Task.findById(req.params.id);
        const user = await User.findById(req.session.user._id);

        if (!task || !user) return res.status(404).send("Task or user not found");

        task.completed = !task.completed;

        // If task is completed, add XP
        if (task.completed) {
            user.xp += task.xpReward;

            // If XP reaches 100, level up and reset XP
            if (user.xp >= 100) {
                user.level += 1;
                user.xp = 0; // Reset XP
            }
        } else {
            user.xp -= task.xpReward; // Remove XP if task is unchecked
        }

        await task.save();
        await user.save();

        res.redirect("/account/dashboard");
    } catch (error) {
        console.error("Error toggling task:", error);
        res.status(500).send("Failed to update task");
    }
});

// DELETE A TASK
router.post("/delete/:id", async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.redirect("/account/dashboard");
    } catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).send("Failed to delete task");
    }
});

module.exports = router;