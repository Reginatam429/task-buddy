const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const session = require('express-session');
const Task = require("./models/task");
const User = require("./models/user");
const Item = require("./models/item");

const port = process.env.PORT ? process.env.PORT : '3000';
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// CONTROLLERS******************************
const authController = require('./controllers/auth.js');
const taskController = require("./controllers/tasks");

// MIDDLEWARE IMPORTS******************************
const isSignedIn = require('./middleware/is-signed-in.js');
const passUserToView = require('./middleware/pass-user-to-view.js');

// MIDDLEWARE *****************************
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
    })
);
app.use('/auth', authController);
app.use(passUserToView);
app.use("/tasks", taskController);
app.set("view engine", "ejs");  
app.set("views", "views");

// ROUTES **********************************
app.get('/', (req, res) => {
    res.render('index.ejs', { currentPage: 'landing', user: req.session.user || null });
});

app.get('/account/home', isSignedIn, async (req, res) => {
    try {
        const user = await User.findById(req.session.user._id).populate("selectedPet");

        res.render('account/home.ejs', {
            currentPage: "dashboard",
            user
        });
    } catch (error) {
        console.error("❌ Error loading home:", error);
        res.status(500).send("Something went wrong");
    }
});

app.get("/account/dashboard", isSignedIn, async (req, res) => {
    try {
        if (!req.session.user) {
            console.log("User is not in session.");
            return res.redirect("/auth/sign-in"); 
        }

        // Fetch the full user data from the database
        const user = await User.findById(req.session.user._id).populate("inventory").populate("selectedPet");
        if (!user) {
            console.log("User not found in database.");
            return res.redirect("/auth/sign-in");
        }
        
        const userTasks = await Task.find({ user: req.session.user._id }); // Fetch tasks

        res.render("account/dashboard", { 
            currentPage: "dashboard",
            user,
            tasks: userTasks // Pass tasks to view
        });
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).send("Failed to load dashboard");
    }
});

app.get("/account/inventory", isSignedIn, async (req, res) => {
    try {
        const user = await User.findById(req.session.user._id).populate("inventory");
        if (!user) return res.status(400).json([]);

        // Fetch all items where unlockLevel is <= user.level
        const unlockedItems = await Item.find({ unlockLevel: { $lte: user.level } });

        // Ensure user's inventory contains all unlocked items
        const unlockedItemIds = unlockedItems.map(item => item._id);
        const userItemIds = user.inventory.map(item => item._id.toString());

        // Check if there are new items to add
        const newItemsToAdd = unlockedItemIds.filter(itemId => !userItemIds.includes(itemId.toString()));

        if (newItemsToAdd.length > 0) {
            user.inventory.push(...newItemsToAdd);
            await user.save();
            console.log(`🎉 New items unlocked: ${newItemsToAdd.length}`);
        }

        res.json(unlockedItems); // ✅ Send all unlocked items
    } catch (error) {
        console.error("❌ ERROR fetching inventory:", error);
        res.status(500).json([]);
    }
});



app.listen(port, () => {
    console.log(`The express app is ready on port ${port}!`);
});
