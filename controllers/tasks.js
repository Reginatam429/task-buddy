const express = require("express");
const router = express.Router();
const Task = require("../models/task");
const User = require("../models/user");
const Item = require("../models/item");

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
        await task.save();

        // **XP Adjustment**
        if (task.completed) {
            user.xp += task.xpReward; // ✅ Add XP when completed
        } else {
            user.xp = Math.max(0, user.xp - task.xpReward); // ✅ Ensure XP never goes below 0
        }

        // Level Up Logic
        if (user.xp >= 100) {
            // user.level += 1;
            user.xp = 0; // Reset XP after leveling up
        }

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

// REWARD USER UPON LEVEL UP
const checkForLevelUp = async (userId) => {
    const user = await User.findById(userId);
    
    // If XP reaches 100, level up
    if (user.xp >= 100) {
        user.level += 1;
        user.xp = 0;

        // Unlock new items based on level
        const newItems = await Item.find({ unlockLevel: user.level });
        if (newItems.length > 0) {
            user.inventory.push(...newItems.map(item => item._id));
            console.log(`🎉 User leveled up! New Items: ${newItems.map(item => item.name).join(", ")}`);
        }

        await user.save();
    }
};

// LEVEL UP ROUTE
router.post("/level-up", async (req, res) => {
    try {
        if (!req.session.user) return res.redirect("/auth/sign-in");

        const user = await User.findById(req.session.user._id);
        if (!user) return res.redirect("/auth/sign-in");

        //user.level += 1;
        user.xp = 0; // Reset XP on level up
        console.log(`🎉 Level Up! New Level: ${user.level}`);

        // Find new items the user just unlocked
        const newItems = await Item.find({ unlockLevel: user.level });

        if (newItems.length > 0) {
            console.log(`🆕 Unlocked ${newItems.length} new items!`);

            // Add new items to inventory
            newItems.forEach(item => {
                if (!user.inventory.includes(item._id)) {
                    user.inventory.push(item._id);
                }
            });

        await user.save();
        console.log("✅ Inventory updated with new items:", user.inventory);
        }

        req.session.user.level = user.level;
        req.session.user.xp = user.xp;
        req.session.user.inventory = user.inventory; // Update session

        res.redirect("/account/dashboard"); // Redirect to refresh inventory
    } catch (error) {
        console.error("❌ Error during level-up:", error);
        res.status(500).send("Failed to level up");
    }
});

module.exports = router;