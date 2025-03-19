const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const User = require('../models/user.js');

// SIGN UP PAGE
router.get('/sign-up', (req, res) => {
    res.render('auth/sign-up.ejs');
});

// SIGN IN PAGE
router.get('/sign-in', (req, res) => {
    res.render('auth/sign-in.ejs');
});

// SIGN OUT ROUTE
router.get('/sign-out', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

// SIGN-UP LOGIC
router.post('/sign-up', async (req, res) => {
    try {
        console.log("🟢 Received sign-up request:", req.body);

        // TRIM WHITESPACE
        const username = req.body.username.trim();

        // UNIQUE USERNAME CHECK
        const userInDatabase = await User.findOne({ username: req.body.username });
        if (userInDatabase) {
        console.log("🔴 Username already taken.");
        return res.send('Username already taken.');
        }
    
        // PASSWORD CHECK MATCH
        if (req.body.password !== req.body.confirmPassword) {
        console.log("🔴 Passwords do not match.");
        return res.send('Password and Confirm Password must match');
        }
    
        // HASH PASSWORD BEFORE STORAGE
        console.log("🟢 Hashing password...");
        const hashedPassword = bcrypt.hashSync(req.body.password, 10);
        req.body.password = hashedPassword;
    
        // CREATE NEW USER
        console.log("🟢 Creating new user...");
        await User.create(req.body);
    
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
        const userInDatabase = await User.findOne({ username: req.body.username });
        if (!userInDatabase) {
        return res.status(400).send('Login failed: User not found.');
        }
        console.log("🟢 User found in database:", userInDatabase);
    
        // PASSWORD VERIFICATION
        console.log("🟢 Checking password...");
        const validPassword = await bcrypt.compareSync(
            req.body.password,
            userInDatabase.password
        );
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

module.exports = router;
