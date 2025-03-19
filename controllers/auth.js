const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const User = require('../models/user.js');

router.get('/sign-up', (req, res) => {
    res.render('auth/sign-up.ejs');
});

router.get('/sign-in', (req, res) => {
    res.render('auth/sign-in.ejs');
});

router.get('/sign-out', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

router.post('/sign-up', async (req, res) => {
    try {
        console.log("🟢 Received sign-up request:", req.body);
        // Check if the username is already taken
        const userInDatabase = await User.findOne({ username: req.body.username });
        if (userInDatabase) {
        console.log("🔴 Username already taken.");
        return res.send('Username already taken.');
        }
    
        // Username is not taken already!
        // Check if the password and confirm password match
        if (req.body.password !== req.body.confirmPassword) {
        console.log("🔴 Passwords do not match.");
        return res.send('Password and Confirm Password must match');
        }
    
        // Must hash the password before sending to the database
        console.log("🟢 Hashing password...");
        const hashedPassword = bcrypt.hashSync(req.body.password, 10);
        req.body.password = hashedPassword;
    
        // All ready to create the new user!
        console.log("🟢 Creating new user...");
        await User.create(req.body);
    
        console.log("✅ User created! Redirecting to sign-in.");
        res.redirect('/auth/sign-in');
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

router.post('/sign-in', async (req, res) => {
    try {
        console.log("🟢 Received sign-in request:", req.body);
        // First, get the user from the database
        const userInDatabase = await User.findOne({ username: req.body.username });
        if (!userInDatabase) {
        return res.send('Login failed. Please try again.');
        }
        console.log("🟢 User found in database:", userInDatabase);
    
        // There is a user! Time to test their password with bcrypt
        console.log("🟢 Checking password...");
        const validPassword = bcrypt.compareSync(
        req.body.password,
        userInDatabase.password
        );
        if (!validPassword) {
        console.log("🔴 Login failed: Incorrect password.");
        return res.send('Login failed. Please try again.');
        }
    
        // There is a user AND they had the correct password. Time to make a session!
        // Avoid storing the password, even in hashed format, in the session
        // If there is other data you want to save to `req.session.user`, do so here!
        console.log("🟢 Password verified!");
        console.log("🟢 Creating session...");
        req.session.user = {
        username: userInDatabase.username,
        _id: userInDatabase._id
    };
    
    console.log(`Signed in as: ${req.session.user.username}`);
    res.redirect('/');
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

module.exports = router;
