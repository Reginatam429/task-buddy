const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    type: { 
        type: String, 
        enum: ["Pet", "Background", "Decoration"], 
        required: true 
    },
    image: { 
        type: String, 
        required: true 
    },
    gameImage: { 
        type: String, 
        required: true 
    },
    unlockLevel: { 
        type: Number, 
        default: 1 
    }
});

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;