const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    description: { type: String, required: true },
    category: { type: String, enum: ["Mood", "Self-added"], required: true },
    mood: { type: String, enum: ["None", "Happy", "Sad", "Angry", "Fearful", "Anxious", "Calm", "Excited"] },
    completed: { type: Boolean, default: false },
    xpReward: { type: Number, default: 10 },
    date: { type: Date, default: Date.now }
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;