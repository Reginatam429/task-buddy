const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const Item = require("../models/item");

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const items = [
    // Pets
    {
        name: "Mushroom Buddy",
        type: "Pet",
        image: "/assets/pets/mushroom-buddy-icon.png", // inventory icon
        gameImage: "/assets/pets/mushroom-buddy.png",  // pet sprite
        unlockLevel: 0,
    },
    {
        name: "Bear Buddy",
        type: "Pet",
        image: "/assets/pets/bear-buddy-icon.png",
        gameImage: "/assets/pets/bear-buddy.png",
        unlockLevel: 0,
    },
    {
        name: "Ducky Buddy",
        type: "Pet",
        image: "/assets/pets/ducky-buddy-icon.png",
        gameImage: "/assets/pets/ducky-buddy.png",
        unlockLevel: 0,
    },

    // Backgrounds
    {
        name: "Starter Background",
        type: "Background",
        image: "/assets/backgrounds/starter.png",
        gameImage: "/assets/backgrounds/starter.png",
        unlockLevel: 1,
    },
    {
        name: "Forest Background",
        type: "Background",
        image: "/assets/backgrounds/forest.png",
        gameImage: "/assets/backgrounds/forest.png",
        unlockLevel: 2,
    },
    {
        name: "Beach Background",
        type: "Background",
        image: "/assets/backgrounds/beach.png",
        gameImage: "/assets/backgrounds/beach.png",
        unlockLevel: 3,
    },
    {
        name: "Enchanted Forest Background",
        type: "Background",
        image: "/assets/backgrounds/enchanted-forest.png",
        gameImage: "/assets/backgrounds/enchanted-forest.png",
        unlockLevel: 4,
    },

    // Decorations
    {
        name: "Balloon",
        type: "Decoration",
        image: "/assets/decor/balloon.gif",
        gameImage: "/assets/decor/balloon.gif",
        unlockLevel: 2,
    },
    {
        name: "Stuffed Toy",
        type: "Decoration",
        image: "/assets/decor/stuffed-toy.png",
        gameImage: "/assets/decor/stuffed-toy.png",
        unlockLevel: 3,
    },
    {
        name: "Ball",
        type: "Decoration",
        image: "/assets/decor/ball.gif",
        gameImage: "/assets/decor/ball.gif",
        unlockLevel: 4,
    },
];

const seedItems = async () => {
    try {
        await Item.deleteMany({});
        await Item.insertMany(items);
        console.log("🌟 Default items added!");
    } catch (err) {
        console.error("❌ Error seeding items:", err);
    } finally {
        mongoose.connection.close();
    }
};

seedItems();
