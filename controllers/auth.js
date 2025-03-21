const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user.js');
const Item = require("../models/item");

// SIGN UP PAGE
router.get("/sign-up", (req, res) => {
    res.render("auth/sign-up", { currentPage: "sign-up", user: req.session.user });
});

// SIGN IN PAGE
router.get("/sign-in", (req, res) => {
    res.render("auth/sign-in", { currentPage: "sign-in", user: req.session.user });
});

// SIGN-UP LOGIC
router.post('/sign-up', async (req, res) => {
    try {
        console.log("🟢 Received sign-up request:", req.body);

        // TRIM WHITESPACE
        const username = req.body.username.trim();

        // UNIQUE USERNAME CHECK
        const userInDatabase = await User.findOne({ username }).populate("selectedPet");
        if (userInDatabase) {
        console.log("🔴 Username already taken.");
        return res.send('Username already taken.');
        }
    
        // PASSWORD CHECK MATCH
        if (req.body.password !== req.body.confirmPassword) {
        console.log("🔴 Passwords do not match.");
        return res.send('Password and Confirm Password must match');
        }
    
        // PASSWORD IS HASHED BY MIDDLEWARE
    
        // CREATE NEW USER
        console.log("🟢 Creating new user...");
        await User.create({ username, password: req.body.password });
    
        console.log("✅ User created! Redirecting to sign-in.");
        res.redirect('/auth/sign-in');
    } catch (error) {
        console.log(error);
        res.status(500).redirect("/");
    }
});

// SIGN-IN LOGIC
router.post('/sign-in', async (req, res) => {
    try {
        console.log("🟢 Received sign-in request:", req.body);

        // TRIM WHITESPACE
        const username = req.body.username.trim();

        // CHECKING IF USER EXISTS
        const userInDatabase = await User.findOne({ username });
        if (!userInDatabase) {
        return res.status(400).send('Login failed: User not found.');
        }
        console.log("🟢 User found in database:", userInDatabase);
    
        // PASSWORD VERIFICATION
        console.log("🟢 Checking password...");
        const validPassword = await bcrypt.compare(req.body.password, userInDatabase.password);
        console.log(`validPassword: ${validPassword}`);
        if (!validPassword) {
            console.log("🔴 Login failed: Incorrect password.");
            return res.status(400).send('Login failed. Please try again.');
        }
    
        // STORE USER SESSION
        console.log("🟢 Password verified!");
        req.session.user = {
            username: userInDatabase.username,
            _id: userInDatabase._id.toString(),
            level: userInDatabase.level,
            xp: userInDatabase.xp,
            inventory: userInDatabase.inventory,
            selectedPet: userInDatabase.selectedPet // 👈 add this
        };

        res.redirect('/account/home');
    } catch (error) {
        console.log("🔴 Error during sign-in:", error);
        res.redirect('/');
    }
});

// LOG OUT LOGIC
router.get("/sign-out", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log("🔴 Error logging out:", err);
            return res.redirect("/account/home");
        }
        res.redirect("/");
    });
});

// PET SELECTION
const starterPets = {
    mushroom: "Mushroom Buddy",
    bear: "Bear Buddy",
    ducky: "Ducky Buddy"
};

router.post("/select-pet", async (req, res) => {
    try {
        if (!req.session.user) {
            console.log("🚨 ERROR: User not logged in. Redirecting to sign-in.");
            return res.redirect("/auth/sign-in");
        }

        const user = await User.findById(req.session.user._id);
        if (!user) {
            console.log("🚨 ERROR: User not found in database.");
            return res.redirect("/auth/sign-in");
        }

        console.log("🟢 User found:", user.username);
        console.log("🔍 Selected Pet Key:", req.body.selectedPet);

        const selectedPetName = starterPets[req.body.selectedPet];
        console.log("🔍 Selected Pet Name:", selectedPetName);

        if (!selectedPetName) {
            console.log("❌ ERROR: Invalid pet selection! Key not recognized.");
            return res.status(400).send("Invalid pet selection");
        }

        // Fetch all pets from MongoDB
        const allPets = await Item.find({ type: "Pet" });
        console.log("🔍 All Pets in DB:", allPets);

        // Find the selected pet
        const selectedPet = allPets.find(pet => pet.name === selectedPetName);
        console.log("🔍 Found Selected Pet:", selectedPet);

        if (!selectedPet) {
            console.log("❌ ERROR: Pet not found in database.");
            return res.status(400).send("Invalid pet selection");
        }

        // Assign unlock levels
        selectedPet.unlockLevel = 1; // The chosen pet unlocks at level 1
        await selectedPet.save();
        console.log(`✅ ${selectedPet.name} set to unlock at level 1`);

        // Get remaining pets
        const remainingPets = allPets.filter(pet => pet.name !== selectedPetName);
        console.log("🔍 Remaining Pets:", remainingPets);

        if (remainingPets.length !== 2) {
            console.error("❌ ERROR: Expected 2 remaining pets, but found:", remainingPets.length);
            return res.status(500).send("Pet selection error");
        }

        // Assign unlock levels randomly to the remaining pets
        let [pet1, pet2] = remainingPets.sort(() => Math.random() - 0.5);
        pet1.unlockLevel = 2;
        pet2.unlockLevel = 3;

        await pet1.save();
        await pet2.save();
        console.log(`🔑 ${pet1.name} assigned unlock level 2`);
        console.log(`🔑 ${pet2.name} assigned unlock level 3`);

        // Add selected pet to user's inventory
        user.inventory.push(selectedPet._id);
        await user.save();
        console.log("🛠 Updated User Inventory:", user.inventory);

        // Store selected pet in user's database record
        user.selectedPet = selectedPet._id;
        await user.save(); // ✅ Save to database

        // Store selected pet in session for quick access
        req.session.user.selectedPet = selectedPet; // ✅ Save in session
        console.log("✅ Pet selection saved in database & session. Redirecting to home.");

        res.redirect("/account/home");
    } catch (error) {
        console.error("❌ ERROR selecting pet:", error);
        res.status(500).send("Something went wrong!");
    }
});

module.exports = router;
