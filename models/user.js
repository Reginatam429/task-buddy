const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    level: { 
        type: Number, 
        default: 1 
    },
    xp: { 
        type: Number, 
        default: 0 
    },
    inventory: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Item" 
    }],
    selectedPet: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Item" 
    },
    timezone: { 
        type: String, 
        default: "UTC" 
    },

    moodHistory: [
        {
            date: { type: Date, default: Date.now },
            mood: {
                type: String,
                enum: ["Happy", "Sad", "Angry", "Fearful", "Anxious", "Calm", "Excited"],
                required: true,
            },
        },
    ],
});

// HASH PASSWORD BEFORE SAVING
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// COMPARE PASSWORDS
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
