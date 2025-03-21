const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const Item = require("../models/item"); // Import Item model

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// List of items to add
const items = [
    // Pets - Start at unlockLevel 0
    { name: "Mushroom Buddy", type: "Pet", image: "/assets/pets/mushroom-buddy.png", unlockLevel: 0 },
    { name: "Bear Buddy", type: "Pet", image: "/assets/pets/bear-buddy.png", unlockLevel: 0 },
    { name: "Ducky Buddy", type: "Pet", image: "/assets/pets/ducky-buddy.png", unlockLevel: 0 },

     // Backgrounds
    { name: "Starter Background", type: "Background", image: "/assets/backgrounds/starter.png", unlockLevel: 1 },
    { name: "Forest Background", type: "Background", image: "/assets/backgrounds/forest.png", unlockLevel: 2 },
    { name: "Beach Background", type: "Background", image: "/assets/backgrounds/beach.png", unlockLevel: 3 },
    { name: "Enchanted Forest Background", type: "Background", image: "/assets/backgrounds/enchanted-forest.png", unlockLevel: 4 },

    // Decorations
    { name: "Ballon", type: "Decoration", image: "/assets/decor/balloon.gif", unlockLevel: 2 },
    { name: "Stuffed Toy", type: "Decoration", image: "/assets/decor/stuffed-toy.png", unlockLevel: 3},
    { name: "Ball", type: "Decoration", image: "/assets/decor/ball.gif", unlockLevel: 4}
];

// Function to insert items
const seedItems = async () => {
    try {
        await Item.deleteMany({}); // Clears existing items
        await Item.insertMany(items);
        console.log("🌟 Default items added!");
        mongoose.connection.close();
    } catch (err) {
        console.error("❌ Error seeding items:", err);
        mongoose.connection.close();
    }
};

// Run the seeder
seedItems();
