const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const User = require('../models/user.js');

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
        const userInDatabase = await User.findOne({ username });
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
            _id: userInDatabase._id
        };
    
        console.log(`Signed in as: ${req.session.user.username}`);
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

module.exports = router;
